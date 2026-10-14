import { createElement } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/projects/ProjectCard';
import useImageViewer from '../hooks/useImageViewer';
import MobileAbout from '../components/home/MobileAbout';
import { useEntranceAnimations } from '../components/animations/RevealOnScroll';

// This renderer keeps the exact Figma composition as real HTML, never a page screenshot.
// Text and image paths come from src/data; geometry comes from src/design/layouts.
function DesignElement({ node, section, projectName, canZoom = false, decorative = false }) {
  const openImage = useImageViewer();
  if (node.textKey) return section.text[node.textKey] ?? '';
  const { imageKey, ...props } = node.attributes;
  const classes = props.className || '';
  const isDecorative = decorative || classes.includes('root-decoration');
  const allowZoom = canZoom || classes.includes('media-slot');
  const children = node.children.map((child, index) => (
    <DesignElement key={index} node={child} section={section} projectName={projectName} canZoom={allowZoom} decorative={isDecorative} />
  ));

  if (node.tag === 'img') {
    const image = section.images[imageKey];
    const zoomable = allowZoom && !isDecorative && !image.src.includes('paper-texture');
    const label = image.alt || projectName + ' — ' + section.title;
    return <img {...props} src={image.src} alt={image.alt || (zoomable ? label : '')}
      className={classes + (zoomable ? ' zoomable-image' : '')} tabIndex={zoomable ? 0 : undefined} role={zoomable ? 'button' : undefined}
      aria-label={zoomable ? 'Open image: ' + label : undefined} aria-haspopup={zoomable ? 'dialog' : undefined}
      onClick={zoomable ? event => { event.stopPropagation(); openImage({ src: image.src, label, opener: event.currentTarget }); } : undefined}
      onKeyDown={zoomable ? event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); event.stopPropagation(); openImage({ src: image.src, label, opener: event.currentTarget }); } } : undefined} />;
  }
  if (classes.includes('project-card')) {
    const link = node.children.find(child => child.tag === 'a');
    const titleNode = node.children.find(child => child.tag === 'h2');
    const label = titleNode?.children.map(child => section.text[child.textKey] || '').join('') || 'project';
    return <ProjectCard {...props} href={link.attributes.href} label={label}>{children}</ProjectCard>;
  }
  if (node.tag === 'a' && props.href?.startsWith('/')) {
    const { href, ...linkProps } = props;
    return <Link {...linkProps} to={href}>{children}</Link>;
  }
  const voidElement = ['img', 'br', 'input'].includes(node.tag);
  return createElement(node.tag, props, voidElement ? undefined : children);
}

export default function DesignFrame({ section, projectName }) {
  const animationRef = useEntranceAnimations(section.id);
  const panelClass = section.id === 'about' ? 'about-panel' : section.id === 'experience' ? 'experience-panel' : section.id === 'contact' ? 'contact-panel' : '';
  return (
    <section ref={animationRef} id={section.id} className={'portfolio-panel ' + panelClass} aria-label={projectName + ' — ' + section.title}>
      <DesignElement node={section.layout} section={section} projectName={projectName} />
      {section.id === 'about' && <MobileAbout section={section} />}
      {section.id === 'contact' && (
        <div className="mobile-contact">
          <p>Let’s discuss the work.</p>
          <a href="mailto:vishnudine@gmail.com">vishnudine@gmail.com ↗</a>
          <a href="https://www.linkedin.com/in/vishnudinesh22/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      )}
    </section>
  );
}
