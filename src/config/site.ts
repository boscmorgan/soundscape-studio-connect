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
 * Brevo's hosted signup form for the mailing list (the "Iscriviti" field on the
 * home page). The site keeps its own input and posts to this endpoint, so the
 * form looks like the rest of the page instead of Brevo's iframe. Safe to ship:
 * it is the public URL Brevo's own embed code posts to, not an API key.
 */
export const newsletterFormUrl =
  'https://586d067f.sibforms.com/serve/MUIFAPjjA8nZAsI9EF45Dz6NaewrZ8w72dZuS0ofM26hCT_yZMUJflB3n7hPO5OUsyuwAyl_MAOmti9z8b0TXFLVDpNa3W7s1fCsaElCYU8P2B7Jia8aQzUyp4LmLZ-t0uQJ0k_L5wKV01cqIPMDw0nlWkT0JKpIlTdshDCsbXtQpCvRQBlAHRpiV7gCZpKBBYafLYi9nYBQY1L2wQ==';

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
