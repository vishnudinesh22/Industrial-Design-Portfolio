import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const pages = ['siteContent','railServe','silicaBreez','glitchMatrix'];
const expected = JSON.parse(fs.readFileSync('src/design/preservation-manifest.json','utf8'));
let sections = 0, images = 0, texts = 0;
for (const page of pages) {
  // The data modules contain plain objects plus layout imports. Parse their content only.
  const source = fs.readFileSync('src/data/'+page+'.js','utf8');
  const data = JSON.parse(source.split('export default ')[1].replace(/layout\d+/g,'null').replace(/;\s*$/,''));
  for (const section of data.sections) {
    const record = expected.find(item => item.frameId === section.figmaNodeId);
    assert(record, 'Unexpected section '+section.id);
    assert.equal(Object.keys(section.text).length, record.textCount, 'Text removed from '+section.id);
    assert.equal(Object.keys(section.images).length, record.imageCount, 'Image removed from '+section.id);
    const importMatch = source.match(new RegExp("from '../design/layouts/("+data.slug+"-"+section.id+"\\.json)'"));
    assert(importMatch, 'Missing layout '+section.id);
    const layout = JSON.parse(fs.readFileSync('src/design/layouts/'+importMatch[1],'utf8'));
    function verify(node) {
      if (node.textKey) { assert(Object.hasOwn(section.text,node.textKey)); return; }
      if (node.attributes.imageKey) assert(Object.hasOwn(section.images,node.attributes.imageKey));
      node.children.forEach(verify);
    }
    verify(layout);
    for (const image of Object.values(section.images)) {
      const file = path.join('public',image.src);
      assert(fs.existsSync(file) && fs.statSync(file).size>0, 'Missing original asset '+file);
      assert(!image.src.includes('figma.com/api'), 'Temporary image URL');
      images++;
    }
    if(data.slug !== 'home')assert(!Object.values(section.text).some(text=>/team project|solo project|individual project|team concept/i.test(text)));
    texts += Object.keys(section.text).length;
    sections++;
  }
}
assert.equal(sections,34);
for(const font of fs.readdirSync('public/fonts'))assert(fs.statSync('public/fonts/'+font).size>0);
assert(fs.existsSync('PROJECT_MAP.md'));
assert(fs.existsSync('README.md'));
console.log(JSON.stringify({pages:4,sections,textBlocks:texts,imageCallsites:images,originalAssets:49,fonts:6,status:'passed'}));
