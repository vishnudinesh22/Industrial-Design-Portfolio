import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import { ImageViewerProvider } from '../../hooks/useImageViewer';

export default function PageLayout() {
  const location = useLocation();
  useEffect(() => {
    // Route changes and anchor links both work without reloading the application.
    const frame = requestAnimationFrame(() => {
      const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: 'auto' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.key]);
  return (
    <ImageViewerProvider>
      <div id="top">
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        <ScrollProgress />
        <Outlet />
        <Footer />
      </div>
    </ImageViewerProvider>
  );
}
