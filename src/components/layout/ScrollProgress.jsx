import { useLocation } from 'react-router-dom';
import useScrollProgress from '../../hooks/useScrollProgress';

export default function ScrollProgress() {
  const { pathname } = useLocation();
  const progress = useScrollProgress();
  if (!['/railserve', '/silica-breez', '/glitch-matrix'].includes(pathname.replace(/\/$/, ''))) return null;
  return (
    <div className="scroll-progress" role="progressbar" aria-label="Case-study reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
      <span style={{ width: progress + '%' }} />
    </div>
  );
}
