# lorenzo1UP

Site for Lorenzo Lucchetti (lorenzo1UP) — <https://lorenzo1up.com>

Two pages:

| Route  | What it is                                                        |
| ------ | ----------------------------------------------------------------- |
| `/`    | One-pager. Full-bleed portrait, outlined wordmark. Does not scroll |
| `/bio` | Biography, collaborations strip, reviews. Scrolls                  |

Italian only — there is no language switch.

## Running it

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # → dist/
npm run lint
npm test
```

Stack: Vite, React 18, TypeScript, Tailwind, a small set of shadcn/ui primitives.

## How the code is organised

```
src/
  config/site.ts     Brand, URLs, socials, hero image sources
  content/index.ts   Every string on the site (Italian)
  styles/tokens.css  Design tokens — the visual source of truth
  styles/base.css    Element defaults and shared utilities
  components/        Presentational components
  components/ui/     shadcn primitives (button, dialog, input, textarea, carousel)
  pages/             Home, Bio, NotFound
  hooks/useSeo.ts    Per-route title / description / canonical
```

Three rules keep this predictable:

1. **No hard-coded strings in components.** Copy lives in `content/`.
2. **No hard-coded colours, sizes, durations.** Those live in `styles/tokens.css`;
   `tailwind.config.ts` only binds utility names to them.
3. **No hard-coded URLs.** Those live in `config/site.ts`.

### Design tokens

`src/styles/tokens.css` is tiered — primitives (`--ink-*`), semantic roles
(`--background`, `--foreground`, …), then component knobs (`--wordmark-*`).
Retuning the identity means editing that one file.

### Wordmark

The wordmark is the supplied artwork (`public/brand/wordmark-*.png`), not type —
it is hand-drawn and cannot be reproduced with a font. `public/brand/` holds
800 / 1600px white PNGs trimmed to their ink bounds, so the layout box equals
the visible mark (intrinsic ratio ~5.36:1).

It is sized by **width** via `--wordmark-width`; height follows the aspect ratio,
so it can never distort. Per-instance overrides use Tailwind arbitrary
properties, e.g. `[--wordmark-width:clamp(11rem,32vw,20rem)]`. Two more knobs:
`--wordmark-offset-y` (home only — drops the mark below the subject's face) and
`--wordmark-shadow` (legibility over lighter parts of the photo).

To regenerate from a new master, trim the transparent margins first:

```python
from PIL import Image
src = Image.open("Logo (White).png").convert("RGBA")
t = src.crop(src.getbbox())
for w in (1600, 800):
    t.resize((w, round(t.height * w / t.width)), Image.LANCZOS) \
     .save(f"public/brand/wordmark-{w}.png", optimize=True)
```

Update `wordmarkImage` in `config/site.ts` if the aspect ratio changes.

### Hero image

`public/hero/` holds 900 / 1600 / 2400px JPEGs generated from the master photo,
served via `srcset`. `index.html` preloads the 1600px variant, and `HeroImage`
cross-fades from an inline 32px blur placeholder so the page never flashes black.

To regenerate from a new master:

```sh
for w in 900 1600 2400; do
  sips -Z $w -s format jpeg -s formatOptions 70 master.jpg --out public/hero/hero-$w.jpg
done
```

## Newsletter — not yet live

The signup UI is complete but **submission is stubbed**. `src/lib/newsletter.ts`
has a single `subscribe()` function that currently throws; wiring Brevo means
implementing that one function.

A Brevo API key must not ship in the bundle — anything reachable from
`import.meta.env` is readable by every visitor. Use either a serverless function
holding the key server-side, or Brevo's own hosted form endpoint. Details are in
the file's header comment.

## SEO

`index.html` carries the real title, description, canonical, Open Graph, Twitter
and JSON-LD (`MusicGroup`) tags, so crawlers that do not run JS still get valid
metadata. `useSeo` updates them on client-side navigation.

Because this is a client-rendered SPA, `/bio` needs the host to rewrite unknown
paths to `index.html` — otherwise a direct hit or a crawler request 404s.

## Deployment

Static build; any static host works. Two requirements:

- SPA fallback rewrite (all paths → `/index.html`)
- `lorenzo1up.com` as the domain, matching the canonical URLs
