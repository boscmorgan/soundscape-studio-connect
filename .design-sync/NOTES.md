# design-sync notes

Repo-specific gotchas for future syncs. Read this before re-running.

Project: `lorenzo1UP — Design System`
→ https://claude.ai/design/p/d165189d-6ae3-4638-807d-17091e46371a

## This repo is an app, not a component library

There is no `dist/`, no `main`/`module`/`exports`, and `private: true`. Two
consequences the converter can't work around on its own:

- **`.design-sync/entry.ts` is the design system's entry point** — a file that
  exists only for this sync. It names the exported surface. Pass it explicitly:
  `--entry ./.design-sync/entry.ts`. Without `--entry` the converter looks for
  `node_modules/lorenzo1up/package.json` and dies with ENOENT.
- **Component discovery cannot come from `.d.ts`** (there is no type build), so
  `cfg.componentSrcMap` pins all 7 components explicitly. The build log printing
  `exported PascalCase symbols: 0` is expected, not a failure — the pinned map
  is what supplies the list. Adding a component means editing BOTH `entry.ts`
  and `componentSrcMap`.

## Scope is deliberate

Only primitives + brand elements sync: Button, Input, Textarea, Dialog,
Carousel, Wordmark, SocialLinks. The user chose this on the first sync.

Deliberately excluded: `Testimonials`, `BrandMarquee`, `HeroImage`,
`NewsletterForm`, `SiteNav`, `ContactDialog`. They read straight from
`@/content` and `@/config/site` instead of taking props, so they aren't
parametrizable and aren't reusable as design-system parts. Don't add them
without making them prop-driven first.

## CSS is generated, not shipped

The repo has only Tailwind *source*. `cfg.buildCmd` compiles it to
`.design-sync/.cache/ds-styles.css` (gitignored, regenerated every run) via
`.design-sync/tailwind.ds.config.ts`, and `cfg.cssEntry` points there.

**That DS-only Tailwind config carries a `safelist`, and it matters.** Tailwind
emits only classes it finds in scanned content, but the design agent composes
new layouts from the whole documented vocabulary. Without the safelist, a design
using `bg-secondary` renders unstyled because that class was never compiled.
**Any class added to `conventions.md` must also be added to the safelist.**

## `tokensGlob` does not work here — don't re-add it

`cfg.tokensGlob` is only honoured alongside `cfg.tokensPkg` and resolves inside
`node_modules/<tokensPkg>` (see `lib/css.mjs` `copyTokens`, which returns early
when `tokensPkg` is unset). Our tokens live in-repo at `src/styles/tokens.css`,
so the key was inert and `tokens/` shipped empty. It has been removed.

Tokens still reach designs correctly: `src/index.css` imports `tokens.css`, so
the whole `:root` block — comments included — is compiled into `_ds_bundle.css`,
which `styles.css` `@import`s. `conventions.md` points the agent there.

## Known render warns

- `[RENDER_SKIPPED]` — **expected on every run so far.** The user declined the
  Playwright/Chromium install (twice, explicitly). All runs use
  `--no-render-check`. Previews have never been machine-verified.
- `tokens: N defined, M referenced (1 missing, below threshold)` — the one
  missing token is `--tw-shadow-color`, a Tailwind internal that shadow
  utilities set inline at the use site. False positive; ignore.

## Re-sync risks — what can silently go stale

- **`.design-sync/entry.ts` and `componentSrcMap` drift from `src/`.** A
  component renamed, moved, or deleted in the site breaks the entry (build
  fails, loudly) — but a *new* component simply never appears in the DS
  (silent). Diff the scoped list against `src/components/` when re-syncing.
- **`dtsPropsFor` is hand-written and does not track the source.** All 7 prop
  contracts in `config.json` were authored by hand because extraction with no
  `.d.ts` yields `[key: string]: unknown`. If a component's props change, the
  uploaded contract is silently wrong and the design agent will code against
  stale types. Re-read the sources when a component changes.
- **`conventions.md` names concrete classes and tokens.** The validation pass
  greps them against the compiled CSS and bundle. Re-run it every sync — a
  renamed token leaves the header confidently pointing at something that no
  longer resolves, which is worse than saying nothing.
- **Previews are floor cards, unverified.** No component has an authored preview
  and none has ever been rendered in a browser. If Playwright is ever allowed,
  authoring `.design-sync/previews/<Name>.tsx` is the single biggest quality
  win available here.
- **The `--wordmark-offset-y` / shadow tuning on the site was never visually
  confirmed** (same Playwright decision). It is a token, so design can retune it.
- **Toolchain at first sync:** node v22.23.1, npm, React 19.2.8, Vite 8,
  Tailwind 3.4.x. Tailwind 4 was deliberately NOT adopted — it replaces the JS
  config with CSS-first `@theme`, which would rewrite both `tailwind.config.ts`
  and the DS-only config above.
