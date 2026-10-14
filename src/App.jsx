import { Route, Routes } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import Home from './pages/Home';
import RailServe from './pages/RailServe';
import SilicaBreez from './pages/SilicaBreez';
import GlitchMatrix from './pages/GlitchMatrix';
import Resume from './pages/Resume';
import NotFound from './pages/NotFound';

// App only chooses pages. Content, layout and interactions live in separate files.
export default function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<Home />} />
        <Route path="railserve" element={<RailServe />} />
        <Route path="silica-breez" element={<SilicaBreez />} />
        <Route path="glitch-matrix" element={<GlitchMatrix />} />
        <Route path="resume" element={<Resume />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
