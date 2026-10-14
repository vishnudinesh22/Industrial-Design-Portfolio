import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => { document.title = 'Page not found — Vishnu Dinesh'; }, []);
  return <main id="main" className="simple-page"><h1>Page not found</h1><p>Let’s get you back to the portfolio.</p><Link to="/">Return home →</Link></main>;
}
