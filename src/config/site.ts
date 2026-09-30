/**
 * Single source of truth for brand identity, URLs and external destinations.
 * Everything that could change without a code change lives here.
 */

export const site = {
  name: 'lorenzo1UP',
  legalName: 'Lorenzo Lucchetti',
  url: 'https://lorenzo1up.com',
  locale: 'it-IT',
  lang: 'it',
  email: 'loe@loelashmusic.com',
  /** Shown in the Bio footer so Spotify for Artists can verify team access. */
  artistEmail: 'lorenzolucchetti@outlook.com',
} as const;

/**
 * Where the "Music" nav item points. External by design — the catalogue lives
 * on streaming platforms, not on this site.
 */
export const musicUrl = 'https://soundcloud.com/loelash';

export type SocialId = 'instagram' | 'youtube' | 'tiktok' | 'soundcloud';

export interface SocialLink {
  id: SocialId;
  label: string;
  href: string;
}

export const socials: readonly SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/loelashmusic/',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCB8DDjynd7VBZEdXlA3kg2g',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@loelashmusic',
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud',
    href: 'https://soundcloud.com/loelash',
  },
] as const;

/**
 * Responsive sources for the full-bleed portrait. Generated from the master
 * file at 900 / 1600px wide plus the 1672px original; `blurDataUri` is a 32px
 * inline placeholder that paints immediately so the page never flashes empty.
 */
export const heroImage = {
  src: '/hero/hero-1600.jpg',
  srcSet: [
    '/hero/hero-900.jpg 900w',
    '/hero/hero-1600.jpg 1600w',
    '/hero/hero-1672.jpg 1672w',
  ].join(', '),
  sizes: '100vw',
  width: 1672,
  height: 941,
} as const;
