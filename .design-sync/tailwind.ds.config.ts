/**
 * Tailwind config for the design-system CSS build only. Never used by the site.
 *
 * Two differences from the site config:
 *
 * 1. It also scans the authored design-sync previews.
 * 2. It SAFELISTS the token-bound utility vocabulary. The site build only emits
 *    utilities the site itself uses, but the design agent composes new layouts
 *    from the whole vocabulary — without the safelist, a design using
 *    `bg-secondary` would silently render unstyled because that class was never
 *    compiled. Anything documented in conventions.md must be safelisted here.
 */
import type { Config } from 'tailwindcss';

import base from '../tailwind.config';

const semanticColors = [
  'background',
  'foreground',
  'card',
  'popover',
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
  'border',
  'input',
  'ring',
];

const colorUtilities = semanticColors.flatMap((name) => [
  `bg-${name}`,
  `text-${name}`,
  `border-${name}`,
  `ring-${name}`,
  `bg-${name}-foreground`,
  `text-${name}-foreground`,
]);

export default {
  ...base,
  content: ['./src/**/*.{ts,tsx}', './.design-sync/previews/**/*.tsx'],
  safelist: [
    ...colorUtilities,
    'duration-fast',
    'duration-base',
    'duration-slow',
    'ease-out',
    'ease-in-out',
    'rounded-sm',
    'rounded-md',
    'rounded-lg',
    'font-sans',
    'h-screen-safe',
    'min-h-screen-safe',
    'marquee-track',
  ],
} satisfies Config;
