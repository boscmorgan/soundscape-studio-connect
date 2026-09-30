import type { Plugin } from 'vite';

import { site, socials } from '../src/config/site';
import { bio } from '../src/content';

/**
 * The app renders client-side, so crawlers and AI scrapers that do not execute
 * JS would otherwise see an empty #root. This plugin bakes the artist identity,
 * contact email and biography into the HTML shell (replaced by React on mount),
 * emits schema.org JSON-LD and publishes an /llms.txt — all from the same
 * content the app renders, so there is a single source of truth.
 */

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const sameAs = socials.map((social) => social.href);

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${site.url}/#person`,
      name: site.legalName,
      alternateName: site.name,
      email: `mailto:${site.artistEmail}`,
      url: `${site.url}/bio`,
      image: `${site.url}/hero/hero-1600.jpg`,
      jobTitle: 'Produttore, ingegnere del suono e DJ',
      description: bio.seoDescription,
      sameAs,
    },
    {
      '@type': 'MusicGroup',
      '@id': `${site.url}/#artist`,
      name: site.name,
      alternateName: site.legalName,
      url: site.url,
      email: `mailto:${site.artistEmail}`,
      image: `${site.url}/hero/hero-1600.jpg`,
      genre: ['Future Beats', 'UK Garage', 'Drum and Bass', 'Electronic'],
      description: bio.seoDescription,
      member: { '@id': `${site.url}/#person` },
      sameAs,
    },
  ],
};

const fallbackHtml = `
      <div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">
        <h1>${escapeHtml(bio.identity)}</h1>
        <p><a href="mailto:${site.artistEmail}">${escapeHtml(site.artistEmail)}</a> — ${escapeHtml(bio.artistEmailNote)}</p>
        <h2>${escapeHtml(bio.title)}</h2>
${bio.paragraphs.map((p) => `        <p>${escapeHtml(p)}</p>`).join('\n')}
        <ul>
${socials.map((s) => `          <li><a href="${s.href}">${escapeHtml(s.label)}</a></li>`).join('\n')}
        </ul>
      </div>
    `;

const llmsTxt = `# ${bio.identity}

> ${bio.seoDescription}

- Full name: ${site.legalName}
- Artist name (a.k.a.): ${site.name}
- Official artist email: ${site.artistEmail} — ${bio.artistEmailNote}
- Website: ${site.url}
- Bio: ${site.url}/bio

## Bio

${bio.paragraphs.join('\n\n')}

## Links

${socials.map((s) => `- [${s.label}](${s.href})`).join('\n')}
`;

export function staticContent(): Plugin {
  return {
    name: 'static-content',
    transformIndexHtml(html) {
      return html
        .replace('<div id="root"></div>', `<div id="root">${fallbackHtml}</div>`)
        .replace(
          '</head>',
          `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
        );
    },
    configureServer(server) {
      server.middlewares.use('/llms.txt', (_req, res) => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(llmsTxt);
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt });
    },
  };
}
