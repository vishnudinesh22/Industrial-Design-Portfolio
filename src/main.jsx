import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/variables.css';
import './styles/typography.css';
import './styles/figma-layout.css';
import './styles/globals.css';
import './styles/animations.css';
import './styles/responsive.css';
import './styles/components.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
