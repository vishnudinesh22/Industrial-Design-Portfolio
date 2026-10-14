# Vishnu Dinesh — Industrial Design Portfolio

React + Vite + React Router. This is a separate website for the industrial portfolio, ready to link from **A Day in Vishnu’s World**. It preserves the approved Figma artwork and all 34 case-study sections. The existing static website is retained separately in `../portfolio-site/`.

## Start in VS Code

Open **this folder** with **File → Open Folder**. Open **Terminal → New Terminal** and run:

```sh
npm install
npm run dev
```

Open the Local URL printed in the terminal. The default is **http://127.0.0.1:4181**. Node 22.12+ or Node 24 is suitable. To test the production build:

```sh
npm run check
npm run build
npm run preview
```

## How the code is organised

`App.jsx` only chooses routes. Each project has its own page and data file. Data files contain readable text and local image paths. Separate layout JSON files retain the Figma geometry. `DesignFrame.jsx` turns those layouts into real React HTML elements; it does not show a screenshot of an entire portfolio page.

Start with **PROJECT_MAP.md** to find the file for a visible section.

## Change homepage text

Open `src/data/siteContent.js`. Find the section with `"id": "hero"`, `"about"`, `"experience"`, `"projects"` or `"contact"`. Edit strings inside its `text` object. Keep the keys unchanged because the layout uses those keys. The mobile About component reads the same data.

Names, contact details, project links and the optional resume PDF are in `src/data/siteSettings.js`. Contact copy inside the approved artwork is also editable in the Contact section of `siteContent.js`.

## Edit a case study

- RailServe: `src/data/railServe.js`
- Silica Breez: `src/data/silicaBreez.js`
- Glitch Matrix: `src/data/glitchMatrix.js`

Each file contains sections in reading order. Edit `text` values, image paths and `label` values. `label` controls the case-study navigation. The IDs must remain stable for existing links to work.

Keep research citations and the distinctions between proposals and tested evidence accurate. Do not add validation results unless you actually have them.

## Replace images

Put an image in the appropriate `public/images/` folder. In the matching section’s `images` object, replace `src` and write a useful `alt` description. Public paths begin with `/images/`, not `/public/images/`.

**ASSET_INVENTORY.json** maps original asset names, Figma frame IDs and local paths. Original images and SVGs have been copied without substitutes. Some source assets are intentionally shared across pages.

## Colours, fonts and layouts

- Colours and repeated design values: `src/styles/variables.css`
- Local font faces: `src/styles/typography.css`; font files: `public/fonts/`
- Navigation, boundaries and image viewer: `src/styles/globals.css`
- Mobile arrangements: `src/styles/responsive.css`
- Progress, resume and extra navigation: `src/styles/components.css`
- Original Figma geometry: `src/styles/figma-layout.css` and `src/design/layouts/`

Most content edits should not require editing geometry. Individual design layers retain `data-node-id` attributes to correlate with Figma. If you intentionally change a composition, locate its section’s layout file first.

## Animations and image viewer

Entrance timing is in `src/components/animations/motionSettings.js`. The existing hero pop-in and scroll reveals are implemented in `RevealOnScroll.jsx`. Existing card hover timing and motion remain in CSS. Reduced-motion preferences are handled by `useReducedMotion.js` and the animation stylesheet.

The click-to-open image viewer is `src/components/ui/ImageLightbox.jsx`. It supports +/−, zoom up to 500%, Fit, scrolling/dragging, Escape, focus restoration and mobile controls.

## Resume

`/resume` presents a printable resume from the education and experience you supplied. It does not invent additional employment details. Use **Print / Save as PDF**.

If you have your own resume PDF, add `public/resume.pdf` and set `resumePdf: '/resume.pdf'` in `src/data/siteSettings.js`. This adds its download link.

## Add a project

1. Add its text and images to a new file in `src/data/`.
2. Add the project’s page in `src/pages/`, following an existing case-study page.
3. Add its route to `App.jsx`.
4. Add it to `featuredProjects` in `src/data/siteSettings.js`.
5. Add a homepage card in the Projects section, using `ProjectCard.jsx` and your chosen layout.

The preservation check protects the current four pages. Update the expected manifest deliberately if you approve structural changes.

## GitHub

A local Git repository can be used without publishing. Create a **separate empty repository** on GitHub for this portfolio. Do not initialise the remote with another README. Replace the example URL below with your real repository URL:

```sh
git init
git add .
git commit -m "Build industrial design portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

For later changes:

```sh
npm run check
npm run build
git add .
git commit -m "Update portfolio content"
git push
```

Never commit passwords, tokens or `.env` files. `node_modules/` and `dist/` are ignored.

## Vercel

1. Sign in to Vercel and select **Add New → Project**.
2. Import this new GitHub repository.
3. Choose the **Vite** framework preset.
4. Build command: `npm run build`. Output directory: `dist`.
5. Deploy when you’re ready.

`vercel.json` includes the React Router fallback so directly opening `/silica-breez`, `/railserve` or `/glitch-matrix` works.

Later GitHub pushes can trigger Vercel redeployments. After the new site is reviewed, update the industrial-design link in the gamified portfolio to its actual deployed URL. The gamified website has not been modified.

This delivery is local only. No GitHub repository or Vercel deployment has been created.

Official references: [Vite guide](https://vite.dev/guide/), [React Router routing](https://reactrouter.com/start/declarative/routing), and [Vite deployment on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## Design preservation

The asset inventory and `src/design/preservation-manifest.json` record the migrated images and text blocks. Run `npm run check` before building. It checks all 34 sections, local assets, font files and content references.

The one-time migration helper in `scripts/migrate-approved-design.cjs` depends on the retained static backup. Do **not** rerun it after editing React content: it would reimport the backup. Normal editing uses only `npm run dev` and `npm run build`.
