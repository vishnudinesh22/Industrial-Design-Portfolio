import { Link } from 'react-router-dom';
import BackToTop from '../ui/BackToTop';

export default function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/#projects">← Back to projects</Link>
      <Link to="/#contact">Let’s discuss the work ↗</Link>
      <BackToTop />
    </footer>
  );
}
