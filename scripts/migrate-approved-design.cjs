// One-time migration of the approved local design. It never changes Figma or the backup.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const project = path.resolve(__dirname, '..');
const previous = path.resolve(project, '../portfolio-site');
const previousDirectory = process.cwd();
process.chdir(previous);
const oldBuilder = fs.readFileSync('build.cjs', 'utf8');
const extraction = oldBuilder.slice(0, oldBuilder.indexOf('const roots='));
const sandbox = { require, result: null };
vm.runInNewContext(extraction + `
const roots = Object.fromEntries(Object.keys(contexts).map(id => [id, prepare(id)]));
Object.values(roots).forEach(render);
result = { roots, flows, anchors, manifest, css: [...styles].map(([s,n]) => '.'+n+'{'+s+'}').join('\\n') };
`, sandbox);
process.chdir(previousDirectory);
const { roots, flows, anchors, manifest, css } = sandbox.result;
const decode = text => text.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const kebab = text => text.replace(/([a-z0-9])([A-Z])/g,'$1-$2').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
const files = new Map();
for (const [frameId, vars] of Object.entries(manifest)) {
  for (const [name, src] of Object.entries(vars)) {
    const filename = path.basename(src);
    if (!files.has(filename)) files.set(filename, { filename, sourceName:name.replace(/^img/,''), usedBy:[] });
    files.get(filename).usedBy.push(frameId);
  }
}
const ownerOf = id => Object.entries(flows).find(([,flow])=>flow.ids.includes(id))?.[0] || 'home';
for (const asset of files.values()) {
  const owners = [...new Set(asset.usedBy.map(ownerOf))];
  const folder = asset.filename === '5fe4f.png' ? 'shared' : owners.find(owner => owner !== 'home') || 'homepage';
  const readable = asset.filename === '5fe4f.png' ? 'paper-texture' : asset.sourceName.length>100 ? 'interface-illustration' : kebab(asset.sourceName).slice(0,64);
  asset.localPath = '/images/'+folder+'/'+readable+'-'+asset.filename;
  const target = path.join(project,'public',asset.localPath);
  fs.mkdirSync(path.dirname(target), { recursive:true });
  fs.copyFileSync(path.join(previous,'dist/assets',asset.filename), target);
}
const assetByName = Object.fromEntries([...files.values()].map(asset=>[asset.filename,asset]));
const essentialClasses = /^(design|artwork|editorial|content-container|layout-row|media-slot|root-decoration|project-index|card-row|project-card|swatch|mockup|mockup-wrap|d\d+)$/;
function convertFrame(frameId) {
  const text = {}, images = {}, usedKeys = new Set();
  function uniqueKey(value, prefix) {
    const words = decode(value).replace(/[\u200b]/g,'').match(/[a-zA-Z0-9]+/g)?.slice(0,5) || [prefix || 'Spacer'];
    const base = prefix + words.map(word=>word[0].toUpperCase()+word.slice(1).toLowerCase()).join('');
    let key=base,index=2;
    while(usedKeys.has(key))key=base+(index++);
    usedKeys.add(key);return key;
  }
  function convert(node, parentName='') {
    if(node.text!==undefined) {
      const key=uniqueKey(node.text,'');text[key]=decode(node.text);
      return { textKey:key };
    }
    const attrs={...node.attrs};
    attrs.className=(attrs.class || '').split(/\s+/).filter(c=>essentialClasses.test(c)).join(' ');
    delete attrs.class;
    delete attrs['data-href'];delete attrs.tabindex;delete attrs.role;delete attrs['aria-label'];
    if(node.tag==='span'){delete attrs.href;delete attrs.target;}
    if(attrs.src) {
      const key=uniqueKey(parentName || attrs['data-name'] || 'image','image');
      const asset=assetByName[path.basename(attrs.src)];
      images[key]={src:asset.localPath,alt:attrs.alt || '',figmaNodeId:frameId,sourceName:asset.sourceName};
      delete attrs.src;delete attrs.alt;attrs.imageKey=key;
    }
    return {tag:node.tag,attributes:attrs,children:node.children.map(child=>convert(child,attrs['data-name']||parentName))};
  }
  const layout=convert(roots[frameId]);
  return {layout,text,images};
}
const sectionLabels={
  home:['Hero','About','Experience','Projects','Contact'],
  railserve:['Overview','Context','Research','Concepts','Layout','Use sequence','CMF','Maintenance','Next steps'],
  'silica-breez':['Overview','Context','Research','Concepts','Components','Architecture','CMF','Maintenance','Next steps'],
  'glitch-matrix':['Overview','Context','Research','Concepts','Assembly','Hardware','Interface','Game loop','CMF','Maintenance','Next steps'],
};
const filenames={home:'siteContent',railserve:'railServe','silica-breez':'silicaBreez','glitch-matrix':'glitchMatrix'};
fs.mkdirSync(path.join(project,'src/design/layouts'),{recursive:true});
fs.mkdirSync(path.join(project,'src/data'),{recursive:true});
const preservation=[];
for (const [slug,flow] of Object.entries(flows)) {
  const sections=flow.ids.map((id,index)=>{
    const frame=convertFrame(id);
    const filename=slug+'-'+anchors[id]+'.json';
    fs.writeFileSync(path.join(project,'src/design/layouts',filename),JSON.stringify(frame.layout,null,2));
    const title=sectionLabels[slug][index];
    preservation.push({frameId:id,section:anchors[id],page:slug,textCount:Object.keys(frame.text).length,imageCount:Object.keys(frame.images).length});
    return {id:anchors[id],figmaNodeId:id,title,label:title,layoutFile:filename,text:frame.text,images:frame.images};
  });
  const imports=sections.map((section,index)=>'import layout'+index+" from '../design/layouts/"+section.layoutFile+"';").join('\n');
  const source=JSON.stringify({slug,title:flow.title,sections},null,2).replace(/"layoutFile": "[^"]+"/g,()=> '"layout": PLACEHOLDER');
  let index=0;
  const data=source.replace(/"layout": PLACEHOLDER/g,()=>'"layout": layout'+index++);
  fs.writeFileSync(path.join(project,'src/data',filenames[slug]+'.js'),'// Edit the text and image paths here. Layout geometry is kept separately.\n'+imports+'\n\nexport default '+data+';\n');
}
fs.mkdirSync(path.join(project,'src/styles'),{recursive:true});
fs.writeFileSync(path.join(project,'src/styles/figma-layout.css'),'/* Original Figma geometry. Normal component styles live in the other stylesheets. */\n'+css);
const oldCSS=fs.readFileSync(path.join(previous,'src/styles.css'),'utf8').replace("@import url('/design.css');",'');
const variableEnd=oldCSS.indexOf('\n');
fs.writeFileSync(path.join(project,'src/styles/variables.css'),oldCSS.slice(0,variableEnd)+'\n');
const mobileStart=oldCSS.indexOf('@media(min-width:1921px)');
const reducedStart=oldCSS.indexOf('@media(prefers-reduced-motion');
fs.writeFileSync(path.join(project,'src/styles/globals.css'),oldCSS.slice(variableEnd,mobileStart));
fs.writeFileSync(path.join(project,'src/styles/responsive.css'),oldCSS.slice(mobileStart,reducedStart));
fs.writeFileSync(path.join(project,'src/styles/animations.css'),oldCSS.slice(reducedStart));
fs.mkdirSync(path.join(project,'public/fonts'),{recursive:true});
let fonts=fs.readFileSync(path.join(previous,'dist/fonts.css'),'utf8');
for (let index=0;index<6;index++) {
  const names=['inter-regular','inter-semibold','inter-bold','rubik-broken-fax','space-grotesk-regular','space-grotesk-bold'];
  const original='font-'+index+'.ttf',name=names[index]+'.ttf';
  fs.copyFileSync(path.join(previous,'dist/assets',original),path.join(project,'public/fonts',name));
  fonts=fonts.replace('/assets/'+original,'/fonts/'+name);
}
fs.writeFileSync(path.join(project,'src/styles/typography.css'),fonts);
fs.writeFileSync(path.join(project,'ASSET_INVENTORY.json'),JSON.stringify({figmaFile:'97hdJrDuXj0vjh4M1xg0A1',assets:[...files.values()],fonts:fs.readdirSync(path.join(project,'public/fonts'))},null,2));
fs.writeFileSync(path.join(project,'src/design/preservation-manifest.json'),JSON.stringify(preservation,null,2));
console.log('Migrated 34 approved sections, '+files.size+' original assets and 6 fonts.');
