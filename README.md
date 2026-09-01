# SYNAPSE — Sajid Islam Portfolio

> An award-style, dependency-free interactive portfolio. Concept: **a mind coming online.**

Built with pure **HTML + CSS + vanilla JavaScript** — no React, no Vue, no build tools, no npm.
Just open `index.html`.

## ✨ Experience

| Section  | Concept |
|----------|---------|
| Hero     | Drafted "Fig. 01" plate + role typer |
| Origin   | Signal-path timeline (student → founder) |
| Ecosystem| Skills as a drawn diagram (falls back to a list under 760px) |
| Memory   | Project cards that open into a detail dialog |
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
- **Projects:** edit the `data` array in `script.js` → `projects()`.
- **Skills:** edit the `data` array in `script.js` → `skills()`.
- **Colors:** change the `--paper / --ink / --accent` tokens at the top of `style.css`.
- **Résumé:** drop `Sajid_Islam_Resume.pdf` into `assets/resume/`.
- **Contact email:** update `hello@sajidislam.dev` in `index.html` **and** the `EMAIL` constant in `script.js` → `terminal()`.
- **Profile links:** live in two places — the `.channels` markup in `index.html`, and the `LINKS` object in `script.js` → `terminal()` (powers the `links`, `github`, `medium`, … commands).

## ♿ Accessibility & performance
- Semantic HTML, ARIA labels, focus-visible styles.
- Project cards are keyboard-operable (`role="button"`, Enter/Space); the detail dialog
  traps Tab, closes on Escape, and returns focus to the card that opened it.
- All text pairs meet WCAG AA on the paper ground (body 5.2:1, accent 7.3:1, ink 15:1).
- Honors `prefers-reduced-motion` (animations disable gracefully).
- No frameworks and no permanently-running canvas loops → tiny footprint, fast first paint.
- Responsive from 320px up; mobile menu, and the skills diagram degrades to a list.

The previous dark/glassmorphism version is preserved in `backup-dark-theme/`.

## 📄 License
MIT © Sajid Islam
