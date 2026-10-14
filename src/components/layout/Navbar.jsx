import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="site-header">
      <Link className="wordmark" to="/#hero">
        Vishnu Dinesh<span>Industrial / Product Design</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link to="/#projects" aria-current={pathname.includes('serve') || pathname.includes('breez') || pathname.includes('matrix') ? 'page' : undefined}>Projects</Link>
        <Link to="/#experience">Experience</Link>
        <Link to="/resume">Resume</Link>
        <Link to="/#contact">Contact ↗</Link>
      </nav>
    </header>
  );
}
