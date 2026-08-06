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

The wordmark is **live type**, not artwork. `Wordmark` sets `site.name` in the
display face (Titan One, self-hosted from `public/fonts/`, SIL OFL 1.1) as a
white outline with a transparent body — `-webkit-text-stroke` plus
`color: transparent`, no fill and no shadow.

It is sized by **font-size** via `--wordmark-size`; the stroke, tracking and
wave amplitude are all in `em`, so overriding that one token rescales the whole
mark. Per-instance overrides use Tailwind arbitrary properties, e.g.
`[--wordmark-size:clamp(1.75rem,5vw,3.15rem)]`. "lorenzo1UP" measures ~6.3× its
font-size, which is how the steps in `tokens.css` were derived.
`--wordmark-offset-y` (home only) drops the mark below the subject's face.

#### The wave

The wave belongs to the **mark**, not to its letters. Nothing splits the word
up: it is rasterised once, then read through a single continuous displacement
field, so the distortion cuts through the middle of a glyph as readily as
between two and stays homogeneous across the whole title.

Three files, in the order the pixels move through them:

| File                       | Does                                                |
| -------------------------- | --------------------------------------------------- |
| `hooks/useWordmarkWave.ts` | Measures the live copy, reads the tokens, drives it   |
| `lib/cssValue.ts`          | Token text to numbers — `em` / `rem` / `ms` and back  |
| `lib/wordmarkRaster.ts`    | Paints the type into an offscreen 2D canvas           |
| `lib/wordmarkWave.ts`      | One quad, one fragment shader — the field itself      |

The geometry in `wordmarkRaster.ts` and the parsing in `cssValue.ts` are pure
and covered by `lib/wordmark.test.ts` — they are the parts that fail *quietly*
(a sign error moves the mark, an unresolved metric erases it), so they are
tested rather than eyeballed.

The technique is the one from [Codrops' wave-motion effect][codrops]: a
noise-and-sine field driving a displacement, with the colour channels sampled a
hair apart. Two differences. It runs on **raw WebGL**, not three.js — this is a
wordmark, and the library would outweigh the rest of the bundle. And the
displacement is per **fragment** on a single quad rather than per vertex on a
subdivided plane, because a 16×16 grid would quantise a wave running through
letterforms, which is the whole thing this is trying to avoid.

The field is two travelling sines plus drifting simplex noise, over position
along the word. The two periods are not integer multiples of each other, so
they drift in and out of phase instead of repeating. Its **slope** does the
rest of the work: letters squash horizontally where the wave is steepest,
crests magnify slightly as though leaning toward the viewer, the top of the
letters trails the bottom through the turn, and the RGB split widens with the
slope and vanishes at the crests, the way a lens behaves.

`Wordmark` renders two copies and shows exactly one. The live type sets the
layout box, carries every token, and is what you see before the texture is
ready, on a machine without WebGL, or if the GL context is lost. The canvas is
the wave. Because the raster reads the live copy back out through
`getComputedStyle`, the CSS stays the only description of the mark.

Under `prefers-reduced-motion` the clock stops but the canvas still paints: the
mark holds the field's shape at t=0 rather than snapping flat. Same when the
tab is hidden or the mark scrolls out of view — the render loop stops, the last
frame stands.

Tuning knobs, all in `tokens.css`: `--wordmark-stroke-width`,
`--wordmark-tracking`, `--wordmark-slant`, then `--wordmark-wave-*` for the
field — `amplitude` and `sway` for size, `cycles*` for how many swells sit
across the word, `duration*` / `drift` for speed, `noise` for how organic it
reads, `depth` and `lean` for the sense of a ribbon rather than a flat wobble,
and `aberration` for the RGB split (set it to `0` for a clean mono mark).

[codrops]: https://tympanus.net/codrops/2020/03/17/create-a-wave-motion-effect-on-an-image-with-three-js/

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
