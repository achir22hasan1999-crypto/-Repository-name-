import { Article } from '../types';
import { DOMAIN_NAME } from './slugUtils';

/**
 * Generates valid sitemap.xml content for the website with all articles
 */
export function generateSitemapXML(articles: Article[]): string {
  const currentDate = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${DOMAIN_NAME}/`, changefreq: 'always', priority: '1.0' },
    { loc: `${DOMAIN_NAME}/category/morocco`, changefreq: 'hourly', priority: '0.9' },
    { loc: `${DOMAIN_NAME}/category/gulf`, changefreq: 'hourly', priority: '0.9' },
    { loc: `${DOMAIN_NAME}/category/world`, changefreq: 'hourly', priority: '0.9' },
    { loc: `${DOMAIN_NAME}/category/economy`, changefreq: 'daily', priority: '0.9' },
    { loc: `${DOMAIN_NAME}/category/agency`, changefreq: 'daily', priority: '0.85' },
    { loc: `${DOMAIN_NAME}/category/cooking`, changefreq: 'daily', priority: '0.8' },
    { loc: `${DOMAIN_NAME}/category/ai`, changefreq: 'daily', priority: '0.8' },
    { loc: `${DOMAIN_NAME}/category/tech`, changefreq: 'daily', priority: '0.8' },
    { loc: `${DOMAIN_NAME}/category/society`, changefreq: 'daily', priority: '0.8' },
    { loc: `${DOMAIN_NAME}/category/culture`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${DOMAIN_NAME}/about`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${DOMAIN_NAME}/authors`, changefreq: 'weekly', priority: '0.6' },
    { loc: `${DOMAIN_NAME}/corrections`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${DOMAIN_NAME}/contact`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${DOMAIN_NAME}/privacy`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${DOMAIN_NAME}/terms`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${DOMAIN_NAME}/cookies`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${DOMAIN_NAME}/disclaimer`, changefreq: 'monthly', priority: '0.5' },
  ];

  const staticXml = staticUrls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  // Filter unique slugs and generate article URLs
  const seenSlugs = new Set<string>();
  const articleXml = articles
    .filter((a) => {
      const slug = a.slug || a.id;
      if (seenSlugs.has(slug)) return false;
      seenSlugs.add(slug);
      return true;
    })
    .map((a) => {
      const slug = a.slug || a.id;
      const pubDate = a.publishDate ? a.publishDate.split('T')[0] : currentDate;
      const isLeadOrBreaking = a.isLead || a.isBreaking;
      return `  <url>
    <loc>${DOMAIN_NAME}/article/${encodeURIComponent(slug)}</loc>
    <lastmod>${pubDate}</lastmod>
    <changefreq>${isLeadOrBreaking ? 'hourly' : 'daily'}</changefreq>
    <priority>${isLeadOrBreaking ? '0.95' : '0.85'}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- الصفحات الرئيسية والأقسام -->
${staticXml}

  <!-- روابط المقالات المنشورة الفريدة -->
${articleXml}
</urlset>`;
}
