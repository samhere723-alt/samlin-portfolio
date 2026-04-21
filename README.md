# Sam Lin — Portfolio Site

AI Visual & Motion Designer portfolio. Cinematic editorial aesthetic.

## For Claude Code — project context

This is a static HTML/CSS portfolio for **Sam Lin**, applying to AI Visual + Motion + UI Design roles. Built as vanilla HTML with a shared CSS design system. No build step. Deploys to Cloudflare Pages as static files.

### Identity
- **Name**: Sam Lin
- **Location**: Taipei, Taiwan
- **Email**: samhere723@gmail.com
- **Tagline (hero H1)**: "Inevitable, not generated."
- **Differentiator**: 8 years of commercial template design + AI generative pipelines. Not just "I use AI tools" — "I build tools where AI tools fail" (see `work/iphone.html` → Lens Master section).

### Design principles — DO NOT BREAK THESE
- **Typography**: Fraunces (display serif) + Inter (body) + JetBrains Mono (metadata). Italic Fraunces is a key accent, colored tungsten amber `#d89454`.
- **Palette**: Near-black warm `#0f0d0c` bg, warm off-white `#eee4d3` text, tungsten amber italic accent only. No other accent colors.
- **No gradient text.** No glassmorphism. No drop shadows except on focus rings. No rounded corners above 4px except pills.
- **No ALL CAPS wide-letter-spacing headings** (like "W O R K"). Tight letter-spacing on display type only.
- **Section labels in mono**: `01 / Section name` style. Never pill-badges-with-backdrop-blur.
- **Italic is the accent** — use sparingly on emphasis words in Fraunces display type.
- **Sentence case everywhere** except mono meta labels.

### File structure
```
samlin-portfolio/
├── index.html              # Home: Hero + Marquee + Grid + Philosophy + Contact
├── work/
│   ├── iphone.html         # Case study: iPhone — Lumière (DONE)
│   └── void.html           # Case study: Void — a hymn (TO BUILD, use iphone.html as template)
├── styles/
│   └── main.css            # Complete design system (DO NOT restyle from scratch)
├── assets/
│   ├── videos/             # Video files (or use YouTube/Vimeo embeds)
│   └── images/             # Stills
└── README.md               # This file
```

### Design system classes (in main.css) — reuse these
- Layout: `.container`, `.section`, `.section-lg`, `.center`
- Typography: `.display-xl`, `.display-l`, `.display-m`, `.display-s`, `.meta`, `.meta-sm`
- Components: `.nav`, `.hero`, `.marquee`, `.filter-row`, `.pill`, `.work-grid`, `.work-item`, `.card`, `.quote-section`, `.quote`, `.tool-stack`, `.contact`, `.footer`
- Case study specific: `.cs-breadcrumb`, `.cs-title-block`, `.cs-title`, `.cs-meta-row`, `.cs-hero-video`, `.cs-intro`, `.cs-side`, `.cs-pipeline`, `.cs-phase`, `.cs-bignum`, `.cs-benefit`, `.cs-showcase-grid`, `.cs-showcase-item`, `.cs-next`

### Deployment
- **Host**: Cloudflare Pages (free, static, no build step)
- **Domain**: samlin.studio (Cloudflare Registrar, ~$21/year)
- **Preview locally**: Open `index.html` directly in browser. No server needed for development.

### Content philosophy
Content is preserved from Sam's original Tailwind-based case studies in `/work/iphone.html` and will be mirrored in `/work/void.html`. **Do NOT rewrite the Chinese prose** — it's been carefully crafted by Sam. Translate structure, preserve voice.

### Home page section order
1. Hero — Inevitable, not generated
2. `#work` Section 01 — Showcase (marquee)
3. Section 02 — Browse by category (filter grid)
4. `#approach` Section 03 — Approach (quote + tool stack)
5. `#bio` Section 04 — About (portrait + prose + 3 numbered practice areas)
6. `#contact` Section 05 — Let's talk
7. Footer

All four nav anchors (`#work`, `#approach`, `#bio`, `#contact`) have matching `id` attributes — verify this does not break when adding new sections.

### Known TODOs
1. Build `work/void.html` using `work/iphone.html` as structural template. Content is in prompt `BUILD_PROMPTS.md`.
2. Replace placeholder gradient thumbnails with real stills once Sam has them.
3. Add Vimeo/YouTube embed URLs to the hero videos on case study pages.
4. Test responsive behavior on 360px–1920px viewports.
5. Add `prefers-reduced-motion` respect check on marquee.
