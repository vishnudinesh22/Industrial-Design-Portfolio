import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const { pathname } = useLocation();
  useEffect(() => {
    let frame;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const readableDistance = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(readableDistance > 0 ? Math.min(100, window.scrollY / readableDistance * 100) : 0);
      });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);
  return progress;
}
