# Project map

| Website feature | File to edit |
|---|---|
| Routes and page addresses | `src/App.jsx` |
| React entry point and stylesheet imports | `src/main.jsx` |
| Home section order | `src/pages/Home.jsx` |
| Hero text, About, Experience, cards and Contact copy | `src/data/siteContent.js` |
| Mobile About arrangement | `src/components/home/MobileAbout.jsx` |
| RailServe page | `src/pages/RailServe.jsx` |
| RailServe text, research, CMF, maintenance and images | `src/data/railServe.js` |
| Silica Breez page | `src/pages/SilicaBreez.jsx` |
| Silica Breez content and images | `src/data/silicaBreez.js` |
| Glitch Matrix page | `src/pages/GlitchMatrix.jsx` |
| Glitch Matrix content and images | `src/data/glitchMatrix.js` |
| Shared case-study structure | `src/components/projects/CaseStudy.jsx` |
| Project hero presentation | `src/components/projects/ProjectHero.jsx` |
| Research presentation | `src/components/projects/ResearchSection.jsx` |
| Other case-study sections | `src/components/projects/DesignProcess.jsx` |
| Original compositions as real HTML | `src/design/DesignFrame.jsx` |
| Individual Figma layer geometry and text/image bindings | `src/design/layouts/<page>-<section>.json` |
| Card click and keyboard navigation | `src/components/projects/ProjectCard.jsx` |
| Case-study section navigation | `src/components/projects/ProjectNavigation.jsx` |
| Header and resume navigation link | `src/components/layout/Navbar.jsx` |
| Footer | `src/components/layout/Footer.jsx` |
| Route/anchor scrolling and global image-viewer context | `src/components/layout/PageLayout.jsx` |
| Reading-progress bar | `src/components/layout/ScrollProgress.jsx` |
| Progress calculation | `src/hooks/useScrollProgress.js` |
| Image popup and zoom controls | `src/components/ui/ImageLightbox.jsx` |
| Which image is open | `src/hooks/useImageViewer.jsx` |
| Back-to-top link | `src/components/ui/BackToTop.jsx` |
| Hero and scroll entrance animations | `src/components/animations/RevealOnScroll.jsx` |
| Entrance timing | `src/components/animations/motionSettings.js` |
| Reduced-motion preference | `src/hooks/useReducedMotion.js` |
| Brand colours and repeated design values | `src/styles/variables.css` |
| Local font definitions | `src/styles/typography.css` |
| Figma geometry styles | `src/styles/figma-layout.css` |
| Boundaries, header, hover effects and viewer styles | `src/styles/globals.css` |
| Mobile layout rules | `src/styles/responsive.css` |
| Reduced-motion styles | `src/styles/animations.css` |
| Progress, printable resume and extra project links | `src/styles/components.css` |
| Printable resume | `src/pages/Resume.jsx` |
| Contact details, optional resume PDF and project list | `src/data/siteSettings.js` |
| Unknown URL page | `src/pages/NotFound.jsx` |
| Original images | `public/images/` |
| Font files | `public/fonts/` |
| Figma-to-local asset mapping | `ASSET_INVENTORY.json` |
| Content/asset preservation check | `scripts/check-content.mjs` |
| Vite server and build configuration | `vite.config.js` |
| Vercel route fallback | `vercel.json` |

## Where to start

For text changes, open a **data file**, not a layout JSON. Keep field names and section IDs unchanged. For a spacing or composition change, find the corresponding layout JSON and its `d...` class in `figma-layout.css`.

All homepage and project sections retain their original Figma node IDs in the data files. Use those IDs to find the source frame.
