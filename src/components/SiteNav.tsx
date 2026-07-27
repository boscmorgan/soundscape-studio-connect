import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { musicUrl } from '@/config/site';
import { nav } from '@/content';

interface SiteNavProps {
  onContact: () => void;
  className?: string;
}

const itemClass =
  'uppercase text-[length:var(--text-nav)] tracking-[--tracking-nav] ' +
  'transition-colors duration-fast hover:text-foreground';

/**
 * Top navigation: Bio (internal route), Music (external), Contact (overlay).
 * Laid out as one centred cluster with generous letter- and item-spacing.
 *
 * NavLink supplies aria-current="page" on the active route, so the current
 * page is announced as well as shown.
 */
export const SiteNav = ({ onContact, className }: SiteNavProps) => (
  <nav
    aria-label="Principale"
    className={cn(
      'flex items-center justify-center gap-[--space-lg] sm:gap-[--space-xl]',
      className,
    )}
  >
    <NavLink
      to="/bio"
      className={({ isActive }) =>
        cn(itemClass, isActive ? 'text-foreground' : 'text-foreground/80')
      }
    >
      {nav.bio}
    </NavLink>
    <a
      href={musicUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(itemClass, 'text-foreground/80')}
    >
      {nav.music}
    </a>
    <button
      type="button"
      onClick={onContact}
      className={cn(itemClass, 'text-foreground/80')}
    >
      {nav.contact}
    </button>
  </nav>
);
