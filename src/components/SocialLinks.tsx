import type { IconType } from 'react-icons';
import { FaInstagram, FaYoutube, FaSoundcloud } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

import { cn } from '@/lib/utils';
import { socials, type SocialId } from '@/config/site';

const icons: Record<SocialId, IconType> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: SiTiktok,
  soundcloud: FaSoundcloud,
};

interface SocialLinksProps {
  className?: string;
}

export const SocialLinks = ({ className }: SocialLinksProps) => (
  <nav aria-label="Social" className={cn('flex items-center gap-1', className)}>
    {socials.map(({ id, label, href }) => {
      const Icon = icons[id];
      return (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="p-2 text-foreground/70 transition-colors duration-fast hover:text-foreground"
        >
          <Icon aria-hidden className="h-[1.15rem] w-[1.15rem]" />
        </a>
      );
    })}
  </nav>
);
