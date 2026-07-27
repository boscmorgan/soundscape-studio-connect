# AGENTS.md

Conventions for working in this repo. See `README.md` for the tour.

## Non-negotiables

- **Italian only.** No `en` strings, no language switch, no locale detection.
  The brand name `lorenzo1UP` and the nav labels (`Bio`, `Music`, `Contact`)
  are deliberately English — leave them.
- **`/` must never scroll.** It is a fixed one-pager. Any change there must keep
  `document.documentElement.scrollHeight === window.innerHeight` at 320px wide
  and up. Check both axes.
- **The brand is `lorenzo1UP`**, lower-case `l`, upper-case `UP`. It was
  previously "Loelash"; that name must not reappear in copy. The social handles
  and contact address still contain `loelash` on purpose — those accounts have
  not been renamed.

## Where things go

| Adding…                    | Goes in                    |
| -------------------------- | -------------------------- |
| User-visible text          | `src/content/index.ts`     |
| A colour, size, duration   | `src/styles/tokens.css`    |
| An external URL or handle  | `src/config/site.ts`       |

Components consume tokens through Tailwind utilities (`text-foreground`,
`duration-fast`) or arbitrary-value syntax (`px-[--edge-x]`,
`text-[length:var(--text-body)]`). Do not write raw hex, px or ms in a component.

Two Tailwind gotchas this repo has already hit:

- `duration-[var(--x)]` and `ease-[var(--x)]` are **ambiguous** (transition vs
  animation). Use the named scale — `duration-fast`, `ease-out` — which
  `tailwind.config.ts` binds to the tokens.
- `@import` must precede `@tailwind` in `src/index.css`, or the build errors.

## Dependencies

The dependency list was cut from 46 to 12; `src/components/ui/` was cut from 50
files to 5. Do not re-add a shadcn component "just in case" — add it when a
component actually imports it, and delete it when the last importer goes.

## Before calling it done

```sh
npm run lint && npm test && npm run build
```

`npm run build` must be warning-free. A Tailwind "ambiguous class" warning means
a class silently did not apply — treat it as an error, not noise.
