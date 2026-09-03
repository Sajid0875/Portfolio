# SYNAPSE — Sajid Islam Portfolio

> An award-style, dependency-free interactive portfolio. Concept: **a mind coming online.**

Built with pure **HTML + CSS + vanilla JavaScript** — no React, no Vue, no build tools, no npm.
Just open `index.html`.

## ✨ Experience

| Section  | Concept |
|----------|---------|
| Hero     | Drafted "Fig. 01" plate + role typer |
| Origin   | Signal-path timeline (education → training → experience) |
| Ecosystem| Skills as a drawn diagram (falls back to a list under 760px) |
| Memory   | Project cards linking to full case-study pages under `/projects/` |
| Channel  | Contact as an interactive terminal + grouped profile links |

## 🎨 Design language
Light "technical plate" theme: bone paper ground, engineering-grid backdrop, ink hairlines,
and a single ultramarine accent. No gradients, no glassmorphism, no glow.

- **Display:** Bricolage Grotesque (headlines)
- **Body:** Newsreader (prose)
- **Utility:** Martian Mono (labels, metadata, terminal, buttons)

Tight 4px radii throughout — pill and blob shapes were removed deliberately.

## 🚀 Run it
Open `index.html`, or serve the folder (`python3 -m http.server 4173`) so the fonts and
résumé link resolve.

## 🧩 Customize
- **Projects:** edit the `<article class="core">` cards in `index.html` → `#projectGrid`, and the
  matching case study under `projects/<slug>/index.html`. (Card content is authored in HTML, not JS,
  so crawlers and AI agents can read it without running JavaScript.)
- **Skills:** edit the `<li class="skill-node">` items in `index.html` → `#skillNodes`
  (`data-x` / `data-y` place each node; `script.js` only positions and draws them).
- **Colors:** change the `--paper / --ink / --accent` tokens at the top of `style.css`.
- **Résumé:** drop `Sajid_Islam_Resume.pdf` into `assets/resume/`.
- **Contact email:** update `sajidislam0875@gmail.com` in `index.html` **and** the `EMAIL` constant in `script.js` → `terminal()`.
- **Profile links:** live in two places — the `.channels` markup in `index.html`, and the `LINKS` object in `script.js` → `terminal()` (powers the `links`, `github`, `medium`, … commands).

## ♿ Accessibility & performance
- Semantic HTML, ARIA labels, focus-visible styles.
- Project cards navigate through real `<a>` links (and a real `<button>` where a card opens a
  dialog instead), so keyboard and no-JS navigation work natively; the detail dialog traps Tab,
  closes on Escape, and returns focus to the control that opened it.
- Scroll reveals are gated behind a `.js` class, so content is visible by default if scripting fails.
- All text pairs meet WCAG AA on the paper ground (body 5.2:1, accent 7.3:1, ink 15:1).
- Honors `prefers-reduced-motion` (animations disable gracefully).
- No frameworks and no permanently-running canvas loops → tiny footprint, fast first paint.
- Responsive from 320px up; mobile menu, and the skills diagram degrades to a list.

The previous dark/glassmorphism version is preserved in `backup-dark-theme/`.

## 📄 License
MIT © Sajid Islam

## 🔎 SEO / AI discovery
`robots.txt`, `sitemap.xml`, `llms.txt`, a 404 page, JSON-LD (Person, SoftwareSourceCode, WebSite,
ProfilePage, BreadcrumbList) and Open Graph/Twitter cards are maintained by hand.

**Keep these in sync when project facts change:** `index.html` (cards + JSON-LD),
`projects/*/index.html`, `llms.txt`, and `sitemap.xml`. Only publish claims supported by the
résumé or the linked repositories.
