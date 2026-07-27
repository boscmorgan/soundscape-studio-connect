import { useEffect } from 'react';

import { site } from '@/config/site';

interface Seo {
  title: string;
  description: string;
  /** Path only, e.g. "/bio". Resolved against the canonical origin. */
  path: string;
}

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/**
 * Keeps title, description and canonical/OG URLs in sync per route.
 * index.html ships correct defaults, so crawlers that do not execute JS still
 * get valid tags; this only updates them on client-side navigation.
 */
export function useSeo({ title, description, path }: Seo) {
  useEffect(() => {
    const url = `${site.url}${path}`;

    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
  }, [title, description, path]);
}
