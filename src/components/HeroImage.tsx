import { useState } from 'react';

import { cn } from '@/lib/utils';
import { heroImage } from '@/config/site';

/**
 * 32px inline placeholder, upscaled and blurred. Paints on first frame so the
 * page never shows an empty black rectangle while the full portrait loads.
 */
const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAEgAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAEgAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMABgYGBgYGCgYGCg4KCgoOEg4ODg4SFxISEhISFxwXFxcXFxccHBwcHBwcHCIiIiIiIicnJycnLCwsLCwsLCwsLP/bAEMBBwcHCwoLEwoKEy4fGh8uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLv/dAAQAAv/aAAwDAQACEQMRAD8A9Q0nx5pNk50+9uxdMD8sy87h79811+pz6Tqmi3DShLiNo/mjLY9wCRyK+GY9L1UDzUjJJxjH1zmvdvDGiC1tAdQvzDqF+kYZW4ECycoeTyWwAc1y1J+zjq/I66FOFR2X9Ip2Os+DdIlu7q40qVbmVUgSIDzI0EZBZkYsMBuGbpkinf8ACf6BBoLaZp9t9nupHHmPgCMZbLbRuOOScAcCq/ijwaFxpFxP5uokM8DqB8zEZWJvYgEg9icV4nJY3kKsbtDEMYG4d81MbVE0/QmvShB3XU//0N7w5FEVYFFICjsKzvHLuuq6qqsQFhgwAeBgCtXw30b/AHRWP46/5C+rf9cYf5CvPx/8N+q/M7sv+NejLF9NMfHKguxHnWfc/wBwVgeIoovttwNi4EsnYf3jW3e/8j0v/Xaz/wDQFrI8Rf8AH9c/9dZP/QjW9D7f+J/oYV/sf4V+p//Z';

interface HeroImageProps {
  alt: string;
  className?: string;
}

export const HeroImage = ({ alt, className }: HeroImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-background', className)}>
      <img
        aria-hidden
        src={BLUR_PLACEHOLDER}
        alt=""
        className={cn(
          'absolute inset-0 h-full w-full scale-105 object-cover object-center blur-xl',
          'transition-opacity duration-slow',
          loaded ? 'opacity-0' : 'opacity-100',
        )}
      />
      <img
        src={heroImage.src}
        srcSet={heroImage.srcSet}
        sizes={heroImage.sizes}
        width={heroImage.width}
        height={heroImage.height}
        alt={alt}
        // React 18 does not map the camelCase prop; the lowercase DOM
        // attribute passes through untouched.
        {...{ fetchpriority: 'high' }}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          'absolute inset-0 h-full w-full object-cover object-center',
          'transition-opacity duration-slow ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/* Scrim keeps the white furniture legible over any part of the photo. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: 'var(--hero-scrim)' }}
      />
    </div>
  );
};
