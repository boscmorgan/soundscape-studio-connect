import { useState } from 'react';

import { cn } from '@/lib/utils';
import { heroImage } from '@/config/site';

/**
 * 32px inline placeholder, upscaled and blurred. Paints on first frame so the
 * page never shows an empty black rectangle while the full portrait loads.
 */
const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkJCQkJCRAJCRAWEBAQFh4WFhYWHiYeHh4eHiYuJiYmJiYmLi4uLi4uLi43Nzc3NzdAQEBAQEhISEhISEhISEj/2wBDAQsMDBIREh8RER9LMyozS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0v/wAARCAAVACADAREAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAABAUCAwYAB//EACgQAAIBAwMDAwUBAAAAAAAAAAECAwAEEQUSITFBUQYTImFxgZGhsf/EABkBAAIDAQAAAAAAAAAAAAAAAAIDAAEEBf/EAB4RAAICAgIDAAAAAAAAAAAAAAABAhESIQMxQVFh/9oADAMBAAIRAxEAPwDlkNujRl2LZBxgYqTk06RSMU1bItzbxxKGUsc+ppoScnTBnFRVoWCg9K0ZQuwqQz//2Q==';

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
