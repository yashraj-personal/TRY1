# Yash Raj — WEB_OS Portfolio

A static, GitHub Pages-ready personal portfolio with an original cinematic web-operative HUD aesthetic. It is built with plain HTML, CSS and JavaScript, with no build step, external JavaScript dependency or private API key.

## What is included

- Short, skippable system startup
- Full-screen tactical navigation, generated menu sound effects and optional Spider-Sense display mode
- Data-driven project mission cards and accessible modal dossiers
- Interactive skills network, achievements, certification archive and animated learning timeline
- Local, simulated `WEB AI` assistant — no API key required
- `Ctrl/Cmd + K` developer terminal with `help`, navigation, `spider-sense` and `clear` commands
- Custom desktop cursor, click-web ripples, responsive touch fallback and reduced-motion support
- Contact form that opens an email draft; it does not claim to send a message from the static website

## Run locally

Because this is a static website, you can open `index.html` directly. For the closest production behavior, serve the folder with any local static server, then visit the displayed local URL.

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Edit portfolio content

All reusable personal content lives in [data/portfolio.js](data/portfolio.js): project text, skills, timeline, achievements and certifications. Update it there rather than searching through the UI files.

Contact values are intentionally visible in [index.html](index.html), so they are easy to change. GitHub and LinkedIn buttons are disabled placeholders on purpose; add real URLs before enabling them.

## Replace visuals

- Hero and finale images: replace `assets/images/spider-hero.jpg` and `assets/images/spider-finale.jpg`, or update their image paths in `index.html`.
- Hanging character: replace `assets/images/spider-hanging.jpg`. It is draggable, click-to-swing, and appears around the hero/finale scenes.
- Profile area: add `assets/images/profile.jpg`, then replace the `portrait-placeholder` element in `index.html` with an `<img>`.
- Audio: interaction audio is generated in-browser by `js/main.js`; it only plays when a visitor turns **SOUND: ON**. You can replace `playSound()` with local audio files later.

## Theme and motion

- Color variables are at the top of [css/main.css](css/main.css).
- Component styles are in [css/components.css](css/components.css).
- Motion and reduced-motion behavior are in [css/animations.css](css/animations.css).
- Breakpoints and touch behavior are in [css/responsive.css](css/responsive.css).

To reduce animation globally, add `@media (prefers-reduced-motion: reduce)` rules already supplied, or remove the calls to `parallax()` and `cursorAndRipple()` in `js/main.js`.

## Add a project

Add an object to the `projects` array in `data/portfolio.js`. Include the same properties as existing projects: `id`, `code`, `title`, `year`, `domain`, `status`, `short`, `overview`, `problem`, `approach`, `tech`, `result` and `learning`. The mission card and dossier are rendered automatically.

## WEB AI integration later

The assistant is deliberately a local knowledge layer so GitHub Pages remains secure. Its response rules live in `assistantResponse()` in `js/main.js`. If a real AI assistant is added later, connect the form to a server-side endpoint (Cloudflare Worker, Vercel Function, etc.) and keep API credentials only in that server environment — never in client-side JavaScript.

## Deploy on GitHub Pages

1. Create a GitHub repository, for example `portfolio`.
2. Upload every file in this folder and commit to the `main` branch.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/(root)`, then save.
6. GitHub will publish it at `https://USERNAME.github.io/portfolio/`.
7. Replace `USERNAME` and `REPOSITORY` in `sitemap.xml` once the final URL is known.

All asset paths are relative, so the site works from a repository subpath without configuration. If images do not load after deployment, confirm that filename capitalization matches exactly and that the asset was committed.

## Troubleshooting

- **No sound:** sound is off by default and starts only after a user click; turn **SOUND: ON** in the header.
- **Motion looks quiet:** this is expected when the visitor/device has enabled Reduced Motion.
- **Contact does not deliver:** this portfolio opens a mail draft. Connect Formspree, FormSubmit or a backend only if you want server-side delivery.
- **Need a real social link:** edit the disabled placeholder buttons only after you have the final profile URL.
