import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectNavigation({ project }) {
  const [active, setActive] = useState(project.sections[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-120px 0px -60% 0px' });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [project]);
  return (
    <nav className="case-nav" aria-label="Case-study sections">
      {project.sections.map(section => (
        <Link key={section.id} to={'/' + project.slug + '#' + section.id} aria-current={active === section.id ? 'true' : undefined}>
          {section.label}
        </Link>
      ))}
    </nav>
  );
}
