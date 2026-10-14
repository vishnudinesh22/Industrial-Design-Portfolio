import { Link } from 'react-router-dom';

export default function MobileAbout({ section }) {
  const text = section.text;
  const images = Object.values(section.images);
  const portrait = images.find(image => /qa1ruy/i.test(image.sourceName));
  const tools = images.filter(image => /5968704|AdobeIllustrator|Photoshop|Sketchbook|BlenderLogo|Fusion360|Solidworks/i.test(image.sourceName));
  return (
    <div className="mobile-about">
      <div className="mobile-about-top">
        <img src={portrait.src} alt="Vishnu Dinesh" loading="lazy" />
        <h2>{text.HelloIM}<br />{text.Vishnu}</h2>
      </div>
      <h3>{text.Education}</h3>
      <p><strong>{text.BDesIndustrialDesign}</strong><br />{text.VelloreInstituteOfTechnologyVit}</p>
      <p>{text.B2bInterfacesTechPackQc}<br />{text.BayneErgonomicBagManufacturing}<br />{text.CmfSelectionNewProductResearch}<br />{text.BrandingPrintProduction}</p>
      <h3>{text.DesignTools}</h3>
      <div className="tool-icons">{tools.map(image => <img key={image.src} src={image.src} alt={image.sourceName} loading="lazy" />)}</div>
      <p>{text.FigmaAdobeIllustratorAdobePhotoshop}<br />{text.AutodeskFusion360Solidworks} {text.BlenderRhino}</p>
      <Link to="/#experience">{text.ExploreMyRolesAndExperience} →</Link>
    </div>
  );
}
