import { Link, useLocation } from 'react-router-dom';

export default function BackToTop() {
  const { pathname } = useLocation();
  return <Link to={pathname + '#top'}>Back to top ↑</Link>;
}
