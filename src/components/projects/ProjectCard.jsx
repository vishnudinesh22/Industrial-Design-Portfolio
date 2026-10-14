import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ href, children, label, ...props }) {
  const navigate = useNavigate();
  return (
    <div {...props} role="link" tabIndex={0} aria-label={'Read ' + label + ' case study'}
      onClick={event => { if (!event.target.closest('a,.zoomable-image')) navigate(href); }}
      onKeyDown={event => { if (event.target === event.currentTarget && ['Enter', ' '].includes(event.key)) { event.preventDefault(); navigate(href); } }}>
      {children}
    </div>
  );
}
