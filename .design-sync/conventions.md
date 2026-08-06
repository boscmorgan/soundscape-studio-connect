## Building with lorenzo1UP

This is the design system behind lorenzo1up.com — the site of an Italian
electronic music producer. It is small and deliberately so: a few primitives,
two brand elements, and a strong token layer. The visual identity is carried by
the tokens and the wordmark artwork, not by a large component inventory.

### The surface is dark. Always.

There is **no light mode**. `--background` is pure black and `--foreground` is
pure white, and every component is drawn for that. Put `bg-background
text-foreground` on your root element and build downward from black — a design
that assumes a white page will produce white-on-white text.

No provider or theme wrapper is needed. Tokens are plain custom properties on
`:root`, so linking `styles.css` is the whole setup.

### Styling idiom: Tailwind utilities bound to tokens

Style with Tailwind classes that resolve to the tokens — never raw hex, px, or
ms values. Three groups:

**Semantic colours** — use these as `bg-*`, `text-*`, `border-*`, `ring-*`, each
with a matching `-foreground` for content drawn on top:

| Class | Use for |
|---|---|
| `bg-background` / `text-foreground` | the page itself |
| `bg-card` / `text-card-foreground` | raised panels |
| `bg-popover` / `text-popover-foreground` | overlays, dialogs |
| `bg-primary` / `text-primary-foreground` | the inverted call-to-action: white surface, black text |
| `bg-secondary`, `bg-muted`, `bg-accent` | progressively quieter greys |
| `text-muted-foreground` | de-emphasised copy |
| `border-border`, `ring-ring` | hairlines and focus rings |
| `text-destructive` | errors only |

Opacity modifiers are the idiomatic way to soften: `text-foreground/70`,
`border-foreground/30`. That is how the site does de-emphasis — not by picking a
different grey.

**Motion** — `duration-fast` (200ms), `duration-base` (400ms), `duration-slow`
(900ms), with `ease-out` and `ease-in-out`.

> **Gotcha that will cost you a debugging cycle:** `duration-[var(--duration-fast)]`
> and `ease-[var(--ease-out)]` are *ambiguous* in Tailwind (transition vs
> animation duration) and silently emit nothing. Always use the named scale
> above.

**Rhythm and type** — these have no named utility; reach them with Tailwind's
arbitrary-value syntax:

```
px-[--edge-x]   py-[--edge-y]                 viewport-edge insets
gap-[--space-md]  p-[--space-lg]  mt-[--space-2xl]
                   2xs · xs · sm · md · lg · xl · 2xl
text-[length:var(--text-nav)]                 also --text-caption, --text-body,
                                              --text-lead, --text-heading
tracking-[--tracking-nav]                     the wide 0.24em nav treatment
leading-[--leading-body]   max-w-[--measure]  long-form copy
```

Type sizes are all `clamp()` — they scale with the viewport, so don't add
responsive variants on top of them.

### Brand elements

`Wordmark` renders the logo as **live type**, set in the display face and
stroked. Size it by overriding its font-size token, never by setting `width` or
`height` directly — the stroke, the tracking and the wave are all in `em`, so
that one token rescales the whole mark:

```jsx
<Wordmark className="[--wordmark-size:clamp(1.75rem,5vw,3.15rem)]" />
```

Pass `as="h1"` on the page that owns the primary heading.

The mark animates: it is rasterised to a texture and read through a continuous
displacement field on a WebGL canvas that overflows its layout box on all four
sides. Two things follow. Don't wrap it in `overflow-hidden` unless you mean to
crop the wave, and don't rely on the canvas — with no WebGL, or before the face
loads, the live type shows through unchanged. Tune the field with the
`--wordmark-wave-*` tokens; `--wordmark-wave-aberration: 0` gives a clean
monochrome mark.

`SocialLinks` takes only `className` — the link set comes from the design
system's own config, so treat it as a fixed block you position.

### Where the truth lives

Read these before styling; they beat any summary here:

- `styles.css` — the single stylesheet entry. Link this one file; it `@import`s
  everything else.
- `_ds_bundle.css` — the compiled stylesheet, and where **every token is
  defined**. The `:root` block near the top carries the full tiered set with its
  original comments: primitives (`--ink-900` … `--paper`), then the semantic
  roles the utilities bind to, then component knobs (`--wordmark-*`,
  `--hero-scrim`, `--marquee-duration`). There is no separate `tokens/` file —
  read this one.
- `components/general/<Name>/<Name>.prompt.md` — per-component usage
- `components/general/<Name>/<Name>.d.ts` — the prop contract

### An idiomatic composition

```jsx
const { Button, Input, Wordmark } = window.Lorenzo1UP;

<div className="min-h-screen-safe bg-background text-foreground px-[--edge-x] py-[--edge-y]">
  <Wordmark as="h1" className="mx-auto [--wordmark-size:clamp(1.75rem,5vw,3.15rem)]" />

  <p className="mt-[--space-lg] max-w-[--measure] text-[length:var(--text-lead)] leading-[--leading-body] text-foreground/85">
    Musica elettronica tra future beats, uk garage e drum&amp;bass.
  </p>

  <form className="mt-[--space-xl] flex items-center gap-[--space-sm]">
    <Input type="email" placeholder="La tua email" className="max-w-xs" />
    <Button type="submit">Iscriviti</Button>
  </form>
</div>
```

Note the mix: library components for the controls, token-bound utility classes
for the layout glue around them. That is the intended division of labour.

### Copy is Italian

The site is Italian-only. Write UI strings in Italian unless told otherwise —
the exception is the navigation, which uses English words (`Bio`, `Music`,
`Contact`) as a deliberate style choice.
