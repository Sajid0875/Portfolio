# Open Graph card sources

These are the **source designs** for the site's social-sharing images. They are plain
HTML + CSS so the cards stay diffable, re-renderable and consistent with the site's
own design tokens — no binary design files, no build step, no dependencies.

| Source | Renders to |
|---|---|
| `og-home.html` | `../images/og-home.png` |
| `og-whatsapp-commerce-copilot.html` | `../images/og-whatsapp-commerce-copilot.png` |
| `og-entropy-aware-data-preservation.html` | `../images/og-entropy-aware-data-preservation.png` |

`_base.css` holds the shared card chrome (paper ground, engineering grid, registration
ticks, type scale). Each card adds only its own layout and its project-specific motif.

## Re-rendering

Every output must be exactly **1200×630**. Rendered with headless Chrome, which is why
`--window-size` and `--force-device-scale-factor=1` are both pinned:

```bash
cd assets/og-src
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for n in og-home og-whatsapp-commerce-copilot og-entropy-aware-data-preservation; do
  "$CHROME" --headless --disable-gpu --hide-scrollbars --no-first-run \
    --user-data-dir="$(mktemp -d)" \
    --window-size=1200,630 --force-device-scale-factor=1 \
    --virtual-time-budget=6000 \
    --screenshot="../images/$n.png" "file://$PWD/$n.html"
done
```

`--virtual-time-budget` matters: the cards load Bricolage Grotesque, Newsreader and
Martian Mono from Google Fonts, and without it Chrome screenshots before the webfonts
arrive and the cards render in fallback faces.

Verify the dimensions afterwards:

```bash
python3 -c "import struct,glob;[print(f,*struct.unpack('>II',open(f,'rb').read()[16:24])) for f in sorted(glob.glob('../images/og-*.png'))]"
```

## Rules for these cards

- Only claims that hold up elsewhere on the site. No statistics, no awards, no partner
  or client logos, no cohort placements.
- The motif must describe the project honestly: the copilot card draws its real request
  path, the preservation card draws scores crossing real decision thresholds.
- Keep content inside the corner registration ticks — that is the crop-safe area.
- If a card's wording changes, update the matching `og:image:alt` / `twitter:image:alt`
  on the page that uses it.
