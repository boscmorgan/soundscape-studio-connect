import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { site } from '@/config/site';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Builds a mailto: URL to the site contact address, encoding both parts. */
export function mailtoLink(subject: string, body?: string) {
  const params = new URLSearchParams({ subject });
  if (body) params.set('body', body);
  return `mailto:${site.email}?${params.toString()}`;
}
