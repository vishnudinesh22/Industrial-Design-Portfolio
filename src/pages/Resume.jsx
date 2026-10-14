import { useEffect } from 'react';
import home from '../data/siteContent';
import { siteSettings } from '../data/siteSettings';
import Button from '../components/ui/Button';

function textGroups(node, section) {
  if (node.textKey) return section.text[node.textKey];
  if (node.tag === 'p') return node.children.map(child => textGroups(child, section)).join('');
  return node.children.flatMap(child => textGroups(child, section));
}

export default function Resume() {
  const about = home.sections.find(section => section.id === 'about');
  const experience = home.sections.find(section => section.id === 'experience');
  const content = experience.layout.children.find(node => node.attributes?.['data-name'] === 'Editorial content');
  const roles = content.children.filter(node => node.attributes?.className?.includes('layout-row')).flatMap(row => row.children);
  useEffect(() => { document.title = 'Resume — Vishnu Dinesh'; }, []);
  return (
    <main id="main" className="resume-page">
      <div className="resume-actions">
        {siteSettings.resumePdf && <a href={siteSettings.resumePdf} download>Download resume PDF ↓</a>}
        <Button onClick={() => window.print()}>Print / Save as PDF</Button>
      </div>
      <h1>{siteSettings.name}</h1>
      <p>{siteSettings.discipline}</p>
      <p><a href={'mailto:' + siteSettings.email}>{siteSettings.email}</a> · <a href={siteSettings.linkedIn}>LinkedIn</a></p>
      <h2>Education</h2>
      <p>{about.text.BDesIndustrialDesign}<br />{about.text.VelloreInstituteOfTechnologyVit}</p>
      <h2>Experience</h2>
      {roles.map((role, index) => (
        <article key={index}>{textGroups(role, experience).filter(Boolean).map((text, line) => line === 0 ? <h3 key={line}>{text}</h3> : <p key={line}>{text}</p>)}</article>
      ))}
      <h2>Design tools</h2>
      <p>{about.text.FigmaAdobeIllustratorAdobePhotoshop}<br />{about.text.AutodeskFusion360Solidworks} {about.text.BlenderRhino}</p>
    </main>
  );
}
