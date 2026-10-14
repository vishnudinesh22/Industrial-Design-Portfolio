import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectHero from './ProjectHero';
import ResearchSection from './ResearchSection';
import DesignProcess from './DesignProcess';
import ProjectNavigation from './ProjectNavigation';
import { featuredProjects } from '../../data/siteSettings';

export default function CaseStudy({ project }) {
  useEffect(() => { document.title = project.title + ' — Vishnu Dinesh'; }, [project]);
  return (
    <>
      <ProjectNavigation project={project} />
      <main id="main">
        <h1 className="sr-only">{project.title} case study</h1>
        {project.sections.map((section, index) => {
          const Section = index === 0 ? ProjectHero : section.label === 'Research' ? ResearchSection : DesignProcess;
          return <Section key={section.id} section={section} projectName={project.title} />;
        })}
        <nav className="more-projects" aria-label="Other case studies">
          <h2>Explore the other projects</h2>
          {featuredProjects.filter(item => item.slug !== project.slug).map(item => <Link key={item.slug} to={'/' + item.slug}>{item.title} →</Link>)}
        </nav>
      </main>
    </>
  );
}
