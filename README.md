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

Each letter is its own span riding one shared keyframe loop, `wordmark-wave`.
A single sine period is spread across the word via a **negative**
`animation-delay` per letter, so the mark reads as a wave on the very first
frame rather than starting flat. Vertical travel is `-cos` and tilt is `sin` —
a quarter period apart, which is what makes the wave travel left to right
instead of wobbling in place.

Under `prefers-reduced-motion` the wave freezes but keeps its shape: the
component also passes each letter's t=0 pose as `--wave-y` / `--wave-r`, which
a media query in `styles/base.css` applies as a static `translate` / `rotate`.
Without it the global reduced-motion rule would park every letter on the same
keyframe and flatten the mark into a straight line.

Tuning knobs, all in `tokens.css`: `--wordmark-stroke-width`,
`--wordmark-tracking`, `--wordmark-slant`, `--wordmark-wave-duration`,
`--wordmark-wave-amplitude`, `--wordmark-wave-tilt`.

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
