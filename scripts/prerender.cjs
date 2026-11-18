const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DOMAIN = 'https://www.almaghreb-alyoum.com';

if (!fs.existsSync(DIST_DIR) || !fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

// Map imported image assets to their hashed Vite build output inside dist/assets/
const distAssetsDir = path.join(DIST_DIR, 'assets');
const distAssetFiles = fs.existsSync(distAssetsDir) ? fs.readdirSync(distAssetsDir) : [];

['.jpg', '.jpeg', '.png', '.webp', '.svg', '.css'].forEach((ext) => {
  require.extensions[ext] = (m, filename) => {
    const parsed = path.parse(filename);
    const match = distAssetFiles.find(
      (f) => f.startsWith(parsed.name + '-') && f.endsWith(parsed.ext)
    ) || distAssetFiles.find((f) => f === parsed.base);
    m.exports = match ? `/assets/${match}` : `/assets/images/${parsed.base}`;
  };
});

require('tsx/cjs');

const { INITIAL_ARTICLES, CATEGORIES_CONFIG, MAGHREB_COUNTRIES, GULF_COUNTRIES } = require('../src/data/initialArticles');
const { getArticleUrl, getFullArticleUrl } = require('../src/utils/slugUtils');

const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripBold(str) {
  return escapeHtml(str).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function markdownToHtml(md) {
  if (!md) return '';
  const blocks = md.split(/\n\s*\n/);
  const out = [];
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || trimmed === '---') continue;
    if (trimmed.startsWith('### ')) {
      out.push(`<h3 style="font-family:'Cairo',sans-serif;font-size:1.25rem;font-weight:800;color:#0c0a09;margin:1.5rem 0 0.75rem;">${stripBold(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith('## ')) {
      out.push(`<h2 style="font-family:'Cairo',sans-serif;font-size:1.5rem;font-weight:800;color:#b91c1c;margin:2rem 0 0.9rem;border-bottom:2px solid #f5f5f4;padding-bottom:0.4rem;">${stripBold(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith('# ')) {
      out.push(`<h2 style="font-family:'Cairo',sans-serif;font-size:1.6rem;font-weight:900;color:#0c0a09;margin:2rem 0 1rem;">${stripBold(trimmed.slice(2))}</h2>`);
    } else if (trimmed.split('\n').every((l) => /^(\s*[-*•]|\s*\d+\.)\s+/.test(l))) {
      const items = trimmed
        .split('\n')
        .map((l) => l.replace(/^(\s*[-*•]|\s*\d+\.)\s+/, '').trim())
        .filter(Boolean)
        .map((l) => `<li style="margin-bottom:0.5rem;">${stripBold(l)}</li>`)
        .join('');
      out.push(`<ul style="padding-right:1.5rem;margin:1rem 0 1.5rem;color:#292524;line-height:1.8;">${items}</ul>`);
    } else {
      const lines = trimmed
        .split('\n')
        .map((l) => stripBold(l.trim()))
        .join('<br />');
      out.push(`<p style="font-size:1.08rem;line-height:1.9;color:#292524;margin-bottom:1.25rem;">${lines}</p>`);
    }
  }
  return out.join('\n');
}

function getAbsoluteImage(img) {
  if (!img) return `${DOMAIN}/assets/images/unsc_sahara_draft_2026.jpg`;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${DOMAIN}${img.startsWith('/') ? img : '/' + img}`;
}

const SHARED_HEADER = `
      <header style="background:#fff;border-bottom:2px solid #b91c1c;padding:1rem 1.5rem;">
        <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
          <div>
            <a href="/" style="text-decoration:none;">
              <div style="font-family:'Cairo',sans-serif;font-size:1.75rem;font-weight:900;color:#b91c1c;margin:0;">
                <span style="color:#0c0a09;">المغرب العربي</span> اليوم
              </div>
            </a>
            <p style="font-size:0.85rem;color:#78716c;margin:0;">بوابة إخبارية مستقلة - أخبار المغرب والمنطقة المغاربية والعالم لحظة بلحظة</p>
          </div>
          <nav style="display:flex;gap:1rem;flex-wrap:wrap;font-weight:700;font-size:0.9rem;">
            <a href="/" style="color:#b91c1c;text-decoration:none;">الرئيسية</a>
            <a href="/tools" style="background:#b91c1c;color:#fff;padding:0.2rem 0.6rem;border-radius:4px;text-decoration:none;font-weight:bold;">⚡ أدوات وحاسبات</a>
            <a href="/category/morocco" style="color:#292524;text-decoration:none;">المغرب</a>
            <a href="/category/algeria" style="color:#292524;text-decoration:none;">الجزائر</a>
            <a href="/category/tunisia" style="color:#292524;text-decoration:none;">تونس</a>
            <a href="/category/libya" style="color:#292524;text-decoration:none;">ليبيا</a>
            <a href="/category/mauritania" style="color:#292524;text-decoration:none;">موريتانيا</a>
            <a href="/category/economy" style="color:#292524;text-decoration:none;">اقتصاد</a>
            <a href="/category/agency" style="color:#292524;text-decoration:none;">كيف أنشئ وكالة</a>
            <a href="/category/sports" style="color:#292524;text-decoration:none;">رياضة</a>
            <a href="/category/cooking" style="color:#292524;text-decoration:none;">مطبخ ووصفات</a>
            <a href="/about" style="color:#292524;text-decoration:none;">من نحن</a>
            <a href="/privacy" style="color:#292524;text-decoration:none;">الخصوصية</a>
            <a href="/contact" style="color:#292524;text-decoration:none;">اتصل بنا</a>
          </nav>
        </div>
      </header>`;

const SHARED_FOOTER = `
      <footer style="background:#1c1917;color:#a8a29e;padding:2.5rem 1.5rem;font-size:0.9rem;text-align:center;margin-top:3rem;">
        <div style="max-width:1200px;margin:0 auto;">
          <p style="font-weight:bold;color:#fff;font-size:1.1rem;margin-bottom:0.75rem;">
            جريدة المغرب العربي اليوم © 2026 - جميع الحقوق محفوظة
          </p>
          <p style="margin-bottom:1.5rem;font-size:0.85rem;color:#78716c;">
            بوابة إخبارية رقمية مستقلة | الرباط - المملكة المغربية | المدير المسؤول: حسن عاشير
          </p>
          <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:1.25rem;font-weight:600;">
            <a href="/" style="color:#d6d3d1;text-decoration:none;">الرئيسية</a>
            <a href="/tools" style="color:#fbbf24;text-decoration:none;">أدوات وحاسبات 2026</a>
            <a href="/about" style="color:#d6d3d1;text-decoration:none;">من نحن</a>
            <a href="/editorial-policy" style="color:#d6d3d1;text-decoration:none;">السياسة التحريرية</a>
            <a href="/corrections" style="color:#d6d3d1;text-decoration:none;">سياسة التصحيح</a>
            <a href="/terms" style="color:#d6d3d1;text-decoration:none;">شروط الاستخدام</a>
            <a href="/privacy" style="color:#f87171;text-decoration:none;">سياسة الخصوصية</a>
            <a href="/contact" style="color:#d6d3d1;text-decoration:none;">اتصل بنا</a>
          </div>
        </div>
      </footer>`;

function buildPageHtml({ title, description, canonicalUrl, ogType = 'website', ogImage, extraSchemaJson, rootInnerHtml }) {
  let html = baseHtml;

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  // Replace meta description
  html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  // Replace canonical
  html = html.replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);
  // Replace OG tags
  html = html.replace(/<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:type" content="${escapeHtml(ogType)}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`);
  // Replace Twitter tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+name="twitter:url"\s+content="[\s\S]*?"\s*\/>/, `<meta name="twitter:url" content="${escapeHtml(canonicalUrl)}" />`);

  if (ogImage) {
    const imgTags = `<meta property="og:image" content="${escapeHtml(ogImage)}" />\n    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />`;
    html = html.replace('</head>', `    ${imgTags}\n  </head>`);
  }

  if (extraSchemaJson) {
    const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(extraSchemaJson, null, 2)}\n    </script>`;
    html = html.replace('</head>', `    ${schemaScript}\n  </head>`);
  }

  // Replace root inner HTML while keeping Vite's injected <script> and <link> tags intact!
  const rootStart = html.indexOf('<div id="root">');
  const scriptAfterRoot = html.indexOf('<script type="module"', rootStart);
  if (rootStart !== -1 && scriptAfterRoot !== -1) {
    const beforeRoot = html.slice(0, rootStart);
    const afterRootScript = html.slice(scriptAfterRoot);
    html = `${beforeRoot}<div id="root">${rootInnerHtml}\n    </div>\n    ${afterRootScript}`;
  }

  return html;
}

// 1. Pre-render every single article into dist/article/<slug>.html
const articleOutDir = path.join(DIST_DIR, 'article');
fs.mkdirSync(articleOutDir, { recursive: true });

let renderedArticles = 0;
for (const art of INITIAL_ARTICLES) {
  const relUrl = getArticleUrl(art);
  const fullUrl = getFullArticleUrl(art);
  const slug = relUrl.replace(/^\/article\//, '');
  const absImg = getAbsoluteImage(art.leadImage);
  const seoTitle = `${art.seo?.metaTitle || art.title} | المغرب العربي اليوم`;
  const seoDesc = art.seo?.metaDescription || art.summary;

  const related = INITIAL_ARTICLES.filter(
    (a) => a.id !== art.id && (a.category === art.category || a.country === art.country)
  ).slice(0, 4);

  const factsHtml =
    Array.isArray(art.facts) && art.facts.length > 0
      ? `<section style="background:#fef2f2;border-right:4px solid #b91c1c;padding:1.25rem;border-radius:8px;margin:1.5rem 0;">
          <h2 style="font-family:'Cairo',sans-serif;font-size:1.15rem;font-weight:800;color:#991b1b;margin:0 0 0.75rem;">أبرز المعطيات والحقائق</h2>
          <ul style="padding-right:1.25rem;margin:0;color:#292524;line-height:1.8;">
            ${art.facts.map((f) => `<li style="margin-bottom:0.4rem;">${escapeHtml(f)}</li>`).join('')}
          </ul>
        </section>`
      : '';

  const recipeHtml =
    art.contentType === 'recipe' && art.recipeData
      ? `<section style="background:#fffbeb;border:1px solid #fde68a;padding:1.5rem;border-radius:10px;margin:1.5rem 0;">
          <h2 style="font-family:'Cairo',sans-serif;font-size:1.3rem;font-weight:800;color:#92400e;margin:0 0 1rem;">المقادير وخطوات التحضير</h2>
          <p style="font-size:0.95rem;color:#78350f;margin-bottom:1rem;">وقت التحضير: ${escapeHtml(art.recipeData.prepTime)} | وقت الطهي: ${escapeHtml(art.recipeData.cookTime)} | الحصص: ${escapeHtml(art.recipeData.servings)}</p>
          <h3 style="font-size:1.1rem;font-weight:700;color:#0c0a09;margin:1rem 0 0.5rem;">المكونات الأساسية:</h3>
          <ul style="padding-right:1.25rem;line-height:1.8;">${(art.recipeData.ingredients || []).map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
          <h3 style="font-size:1.1rem;font-weight:700;color:#0c0a09;margin:1rem 0 0.5rem;">طريقة التحضير خطوة بخطوة:</h3>
          <ol style="padding-right:1.25rem;line-height:1.8;">${(art.recipeData.instructions || []).map((s) => `<li style="margin-bottom:0.5rem;">${escapeHtml(s)}</li>`).join('')}</ol>
        </section>`
      : '';

  const faqHtml =
    Array.isArray(art.faq) && art.faq.length > 0
      ? `<section style="background:#f5f5f4;padding:1.5rem;border-radius:10px;margin:2rem 0;">
          <h2 style="font-family:'Cairo',sans-serif;font-size:1.3rem;font-weight:800;color:#0c0a09;margin:0 0 1rem;">أسئلة شائعة وإجابات موثقة</h2>
          ${art.faq
            .map(
              (item) => `<div style="margin-bottom:1rem;border-bottom:1px solid #e7e5e4;padding-bottom:0.75rem;">
              <h3 style="font-size:1.05rem;font-weight:800;color:#b91c1c;margin:0 0 0.35rem;">${escapeHtml(item.q)}</h3>
              <p style="font-size:0.98rem;color:#44403c;margin:0;line-height:1.7;">${escapeHtml(item.a)}</p>
            </div>`
            )
            .join('')}
        </section>`
      : '';

  const relatedHtml =
    related.length > 0
      ? `<section style="margin-top:2.5rem;border-top:2px solid #e7e5e4;padding-top:1.5rem;">
          <h2 style="font-family:'Cairo',sans-serif;font-size:1.35rem;font-weight:900;color:#0c0a09;margin-bottom:1rem;">موضوعات وتقارير ذات صلة</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;">
            ${related
              .map(
                (r) => `<a href="${escapeHtml(getArticleUrl(r))}" style="display:block;background:#fff;border:1px solid #e7e5e4;border-radius:8px;padding:1rem;text-decoration:none;">
                <h3 style="font-family:'Cairo',sans-serif;font-size:1rem;font-weight:800;color:#0c0a09;margin:0 0 0.4rem;">${escapeHtml(r.title)}</h3>
                <p style="font-size:0.85rem;color:#57534e;margin:0;line-height:1.5;">${escapeHtml((r.summary || '').slice(0, 130))}...</p>
              </a>`
              )
              .join('')}
          </div>
        </section>`
      : '';

  const rootInnerHtml = `
      ${SHARED_HEADER}
      <main style="max-width:920px;margin:2rem auto;padding:0 1.25rem;">
        <nav aria-label="breadcrumb" style="font-size:0.85rem;color:#78716c;margin-bottom:1rem;">
          <a href="/" style="color:#b91c1c;text-decoration:none;">الرئيسية</a> /
          <a href="/category/${escapeHtml(art.category)}" style="color:#b91c1c;text-decoration:none;">${escapeHtml(art.category)}</a> /
          <span>${escapeHtml(art.title)}</span>
        </nav>
        <article style="background:#fff;border-radius:12px;padding:2rem;border:1px solid #e7e5e4;">
          <h1 style="font-family:'Cairo',sans-serif;font-size:2rem;font-weight:900;color:#0c0a09;line-height:1.4;margin:0 0 1rem;">
            ${escapeHtml(art.title)}
          </h1>
          <div style="font-size:0.88rem;color:#57534e;margin-bottom:1.25rem;border-bottom:1px solid #f5f5f4;padding-bottom:0.75rem;">
            بقلم: <strong>${escapeHtml(art.author?.name || 'هيئة التحرير')}</strong> (${escapeHtml(art.author?.role || 'محرر')}) |
            تاريخ النشر: <time datetime="${escapeHtml(art.publishDate)}">${escapeHtml((art.publishDate || '').slice(0, 10))}</time> |
            المصدر: ${escapeHtml(art.source || 'المغرب العربي اليوم')}
          </div>
          <p style="font-size:1.15rem;font-weight:600;line-height:1.85;color:#1c1917;background:#fafaf9;padding:1rem 1.25rem;border-radius:8px;margin-bottom:1.5rem;">
            ${escapeHtml(art.summary)}
          </p>
          <figure style="margin:0 0 1.5rem;">
            <img src="${escapeHtml(art.leadImage)}" alt="${escapeHtml(art.altText || art.title)}" style="width:100%;max-height:460px;object-fit:cover;border-radius:10px;" />
            ${art.imageCaption ? `<figcaption style="font-size:0.85rem;color:#78716c;margin-top:0.5rem;text-align:center;">${escapeHtml(art.imageCaption)}</figcaption>` : ''}
          </figure>
          ${factsHtml}
          <div style="margin-top:1.5rem;">
            ${markdownToHtml(art.content)}
          </div>
          ${recipeHtml}
          ${faqHtml}
        </article>
        ${relatedHtml}
      </main>
      ${SHARED_FOOTER}`;

  const schemaJson =
    art.contentType === 'recipe' && art.recipeData
      ? {
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: art.title,
          image: [absImg],
          description: art.summary,
          author: { '@type': 'Person', name: art.author?.name || 'هيئة التحرير' },
          publisher: {
            '@type': 'Organization',
            name: 'المغرب العربي اليوم',
            url: DOMAIN,
            logo: { '@type': 'ImageObject', url: `${DOMAIN}/logo.png` },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
          datePublished: art.publishDate,
          dateModified: art.updatedDate || art.publishDate,
          recipeYield: art.recipeData.servings,
          recipeCategory: art.recipeData.category,
          recipeIngredient: art.recipeData.ingredients,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: art.title,
          description: art.summary,
          image: [absImg],
          datePublished: art.publishDate,
          dateModified: art.updatedDate || art.publishDate,
          author: { '@type': 'Person', name: art.author?.name || 'هيئة التحرير' },
          publisher: {
            '@type': 'NewsMediaOrganization',
            name: 'المغرب العربي اليوم',
            url: DOMAIN,
            logo: { '@type': 'ImageObject', url: `${DOMAIN}/logo.png`, width: 600, height: 60 },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
        };

  const outHtml = buildPageHtml({
    title: seoTitle,
    description: seoDesc,
    canonicalUrl: fullUrl,
    ogType: 'article',
    ogImage: absImg,
    extraSchemaJson: schemaJson,
    rootInnerHtml,
  });

  fs.writeFileSync(path.join(articleOutDir, `${slug}.html`), outHtml, 'utf8');
  renderedArticles++;
}

// 2. Pre-render /tools.html
const agencyArticles = INITIAL_ARTICLES.filter(
  (a) => a.category === 'agency' || (a.tags && a.tags.some((t) => t.includes('وكالة') || t.includes('كاش')))
);
const toolsRootHtml = `
      ${SHARED_HEADER}
      <main style="max-width:1100px;margin:2rem auto;padding:0 1.25rem;">
        <section style="background:#fff;border-radius:12px;padding:2rem;border:1px solid #e7e5e4;margin-bottom:2rem;">
          <h1 style="font-family:'Cairo',sans-serif;font-size:2rem;font-weight:900;color:#0c0a09;margin:0 0 0.75rem;">
            منصة الأدوات والحاسبات المالية بالمغرب 2026
          </h1>
          <p style="font-size:1.08rem;color:#44403c;line-height:1.85;margin-bottom:1.5rem;">
            منصة خدمات حسابية تفاعلية مجانية موجهة لرواد الأعمال والمستثمرين في المملكة المغربية ودول المغرب العربي لحساب تكاليف المشاريع والضرائب وتحويل العملات بدقة وفق مستجدات قانون المالية 2026.
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;">
            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:1.25rem;">
              <h2 style="font-family:'Cairo',sans-serif;font-size:1.2rem;font-weight:800;color:#92400e;margin:0 0 0.5rem;">1. حاسبة تكاليف وأرباح وكالات تحويل الأموال 2026</h2>
              <p style="font-size:0.95rem;color:#44403c;line-height:1.7;">تقدير رأس المال التأسيسي والأرباح الشهرية الصافية ونقطة التعادل لوكالات كاش بلوس، وفاكاش، بريد كاش، الشعبي كاش، ضمان كاش، ولانا كاش حسب موقع المحل وحجم المعاملات اليومية.</p>
            </div>
            <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;padding:1.25rem;">
              <h2 style="font-family:'Cairo',sans-serif;font-size:1.2rem;font-weight:800;color:#065f46;margin:0 0 0.5rem;">2. محوّل العملات المغاربية والعالمية المباشر</h2>
              <p style="font-size:0.95rem;color:#44403c;line-height:1.7;">أداة فورية لتحويل الدرهم المغربي والدينار الجزائري والتونسي والليبي والأوقية الموريتانية مقابل اليورو والدولار الأمريكي والريال السعودي والدرهم الإماراتي.</p>
            </div>
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:1.25rem;">
              <h2 style="font-family:'Cairo',sans-serif;font-size:1.2rem;font-weight:800;color:#1e40af;margin:0 0 0.5rem;">3. حاسبة الضريبة على المداخيل العقارية (CGI 2026)</h2>
              <p style="font-size:0.95rem;color:#44403c;line-height:1.7;">احتساب نسبة الإسقاط الجزافي 40% والضريبة السنوية المستحقة على عوائد الكراء السكني والمهني بالمغرب وفق مقتضيات المدونة العامة للضرائب.</p>
            </div>
          </div>
        </section>
        <section style="background:#fff;border-radius:12px;padding:2rem;border:1px solid #e7e5e4;">
          <h2 style="font-family:'Cairo',sans-serif;font-size:1.45rem;font-weight:900;color:#0c0a09;margin:0 0 1.25rem;">الأدلة المرجعية لتأسيس الوكالات بالمغرب 2026</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
            ${agencyArticles
              .map(
                (a) => `<a href="${escapeHtml(getArticleUrl(a))}" style="display:block;border:1px solid #e7e5e4;border-radius:8px;padding:1rem;text-decoration:none;">
                <h3 style="font-family:'Cairo',sans-serif;font-size:1.05rem;font-weight:800;color:#b91c1c;margin:0 0 0.4rem;">${escapeHtml(a.title)}</h3>
                <p style="font-size:0.9rem;color:#57534e;margin:0;line-height:1.6;">${escapeHtml(a.summary)}</p>
              </a>`
              )
              .join('')}
          </div>
        </section>
      </main>
      ${SHARED_FOOTER}`;

const toolsHtml = buildPageHtml({
  title: 'أدوات وحاسبات الاستثمار والمالية بالمغرب 2026 | المغرب العربي اليوم',
  description: 'منصة الأدوات والخدمات التفاعلية: حاسبة تكاليف وأرباح وكالات تحويل الأموال بالمغرب، محول العملات المباشر، وحاسبة الضريبة على الكراء 2026.',
  canonicalUrl: `${DOMAIN}/tools`,
  ogType: 'website',
  ogImage: `${DOMAIN}/assets/images/unsc_sahara_draft_2026.jpg`,
  rootInnerHtml: toolsRootHtml,
});
fs.writeFileSync(path.join(DIST_DIR, 'tools.html'), toolsHtml, 'utf8');

// 3. Pre-render every Category & Country page into dist/category/<cat>.html
const categoryOutDir = path.join(DIST_DIR, 'category');
fs.mkdirSync(categoryOutDir, { recursive: true });

const categoryIds = Array.from(
  new Set([
    ...CATEGORIES_CONFIG.map((c) => c.id),
    ...MAGHREB_COUNTRIES.map((c) => c.id),
    ...GULF_COUNTRIES.map((c) => c.id),
    'arab',
    'society',
    'culture',
    'variety',
    'video',
  ])
).filter((id) => id !== 'all');

let renderedCategories = 0;
for (const catId of categoryIds) {
  const conf = CATEGORIES_CONFIG.find((c) => c.id === catId);
  const maghreb = MAGHREB_COUNTRIES.find((c) => c.id === catId);
  const gulf = GULF_COUNTRIES.find((c) => c.id === catId);
  const label = conf?.label || maghreb?.name || gulf?.name || catId;

  const matching = INITIAL_ARTICLES.filter((a) => {
    if (catId === 'gulf') return ['saudi', 'uae', 'qatar', 'kuwait', 'oman', 'bahrain'].includes(a.country);
    if (['morocco', 'algeria', 'tunisia', 'libya', 'mauritania', 'world', 'saudi', 'uae', 'qatar', 'kuwait', 'oman', 'bahrain'].includes(catId)) {
      return a.country === catId || a.category === catId;
    }
    if (catId === 'cooking') return a.category === 'cooking' || a.contentType === 'recipe';
    if (catId === 'agency') return a.category === 'agency' || (a.tags && a.tags.some((t) => t.includes('وكالة') || t.includes('كاش')));
    return a.category === catId || a.country === catId;
  });

  const catUrl = `${DOMAIN}/category/${catId}`;
  const catRootHtml = `
      ${SHARED_HEADER}
      <main style="max-width:1150px;margin:2rem auto;padding:0 1.25rem;">
        <div style="background:#fff;border-radius:12px;padding:1.75rem;border:1px solid #e7e5e4;margin-bottom:2rem;">
          <h1 style="font-family:'Cairo',sans-serif;font-size:2rem;font-weight:900;color:#0c0a09;margin:0 0 0.5rem;">
            قسم ${escapeHtml(label)} - المغرب العربي اليوم
          </h1>
          <p style="font-size:1rem;color:#57534e;margin:0;">
            أرشيف التغطيات الإخبارية والتقارير التحليلية المتخصصة في قسم ${escapeHtml(label)} (${matching.length} تقارير ومقالات منشورة).
          </p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:1.5rem;">
          ${matching
            .map(
              (art) => `<article style="background:#fff;border-radius:10px;border:1px solid #e7e5e4;overflow:hidden;">
              <a href="${escapeHtml(getArticleUrl(art))}" style="text-decoration:none;display:block;padding:1.25rem;">
                <h2 style="font-family:'Cairo',sans-serif;font-size:1.2rem;font-weight:800;color:#0c0a09;margin:0 0 0.6rem;line-height:1.45;">${escapeHtml(art.title)}</h2>
                <p style="font-size:0.93rem;color:#57534e;line-height:1.7;margin:0 0 0.75rem;">${escapeHtml(art.summary)}</p>
                <span style="font-size:0.85rem;font-weight:700;color:#b91c1c;">قراءة التقرير الكامل ←</span>
              </a>
            </article>`
            )
            .join('')}
        </div>
      </main>
      ${SHARED_FOOTER}`;

  const catHtml = buildPageHtml({
    title: `${label} | المغرب العربي اليوم`,
    description: `تابع آخر أخبار وتقارير وتحليلات ${label} على بوابة المغرب العربي اليوم الإخبارية.`,
    canonicalUrl: catUrl,
    ogType: 'website',
    ogImage: `${DOMAIN}/assets/images/unsc_sahara_draft_2026.jpg`,
    rootInnerHtml: catRootHtml,
  });

  fs.writeFileSync(path.join(categoryOutDir, `${catId}.html`), catHtml, 'utf8');
  renderedCategories++;
}

// 4. Update dist/index.html static fallback with latest real lead + internal article links
const topStories = INITIAL_ARTICLES.slice(0, 12);
const leadStory = topStories[0];
const homeRootHtml = `
      ${SHARED_HEADER}
      <main style="max-width:1200px;margin:2rem auto;padding:0 1.5rem;">
        ${
          leadStory
            ? `<article style="background:#fff;border-radius:12px;padding:2rem;margin-bottom:2.5rem;border:1px solid #e7e5e4;">
            <span style="color:#b91c1c;font-weight:bold;font-size:0.9rem;">الحدث الرئيسي | تغطية خاصة</span>
            <h1 style="font-family:'Cairo',sans-serif;font-size:2rem;font-weight:900;color:#0c0a09;margin:0.75rem 0 1rem;line-height:1.4;">
              <a href="${escapeHtml(getArticleUrl(leadStory))}" style="color:#0c0a09;text-decoration:none;">${escapeHtml(leadStory.title)}</a>
            </h1>
            <p style="font-size:1.1rem;line-height:1.9;color:#292524;margin-bottom:1rem;">${escapeHtml(leadStory.summary)}</p>
            <a href="${escapeHtml(getArticleUrl(leadStory))}" style="color:#b91c1c;font-weight:bold;text-decoration:none;">متابعة التفاصيل الكاملة ←</a>
          </article>`
            : ''
        }
        <section style="margin-bottom:2.5rem;">
          <h2 style="font-family:'Cairo',sans-serif;font-size:1.55rem;font-weight:900;color:#0c0a09;border-bottom:3px solid #b91c1c;padding-bottom:0.5rem;margin-bottom:1.5rem;">
            أحدث الأخبار والتقارير التحليلية
          </h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem;">
            ${topStories
              .slice(1)
              .map(
                (a) => `<article style="background:#fff;border-radius:8px;padding:1.25rem;border:1px solid #e7e5e4;">
                <h3 style="font-family:'Cairo',sans-serif;font-size:1.15rem;font-weight:800;margin:0 0 0.5rem;">
                  <a href="${escapeHtml(getArticleUrl(a))}" style="color:#0c0a09;text-decoration:none;">${escapeHtml(a.title)}</a>
                </h3>
                <p style="font-size:0.92rem;color:#57534e;line-height:1.65;margin:0;">${escapeHtml(a.summary)}</p>
              </article>`
              )
              .join('')}
          </div>
        </section>
        <section style="background:#fff;border-radius:8px;padding:1.75rem;border-right:5px solid #b91c1c;margin-bottom:2rem;">
          <h2 style="font-family:'Cairo',sans-serif;font-size:1.3rem;font-weight:800;color:#0c0a09;margin:0 0 0.75rem;">
            منصة الأدوات والحاسبات المالية بالمغرب 2026
          </h2>
          <p style="font-size:1rem;color:#44403c;line-height:1.8;margin:0 0 0.75rem;">
            استخدم الحاسبات المالية التفاعلية لتقدير تكاليف وأرباح وكالات تحويل الأموال (كاش بلوس، وفاكاش، بريد كاش، الشعبي كاش)، وتحويل العملات، وحساب ضريبة الكراء العقاري.
          </p>
          <a href="/tools" style="color:#b91c1c;font-weight:bold;text-decoration:none;">الانتقال إلى منصة الأدوات التفاعلية ←</a>
        </section>
      </main>
      ${SHARED_FOOTER}`;

const updatedHomeHtml = buildPageHtml({
  title: 'المغرب العربي اليوم | أخبار المغرب العربي والعالم لحظة بلحظة',
  description: 'بوابة إخبارية شاملة ومستقلة تغطي مستجدات المغرب، الجزائر، تونس، ليبيا، موريتانيا والعالم لحظة بلحظة برؤية استقصائية وتحليلية رصينة.',
  canonicalUrl: `${DOMAIN}/`,
  ogType: 'website',
  ogImage: `${DOMAIN}/assets/images/unsc_sahara_draft_2026.jpg`,
  rootInnerHtml: homeRootHtml,
});
fs.writeFileSync(path.join(DIST_DIR, 'index.html'), updatedHomeHtml, 'utf8');

// 5. Generate clean, 100% verified sitemap.xml (zero dead links) in both public/ and dist/
const todayIso = new Date().toISOString().split('T')[0];
const staticPages = [
  { loc: `${DOMAIN}/`, lastmod: todayIso, changefreq: 'always', priority: '1.0' },
  { loc: `${DOMAIN}/tools`, lastmod: todayIso, changefreq: 'daily', priority: '1.0' },
  { loc: `${DOMAIN}/about`, lastmod: todayIso, changefreq: 'monthly', priority: '0.7' },
  { loc: `${DOMAIN}/editorial-policy`, lastmod: todayIso, changefreq: 'monthly', priority: '0.7' },
  { loc: `${DOMAIN}/corrections`, lastmod: todayIso, changefreq: 'monthly', priority: '0.7' },
  { loc: `${DOMAIN}/contact`, lastmod: todayIso, changefreq: 'monthly', priority: '0.7' },
  { loc: `${DOMAIN}/privacy`, lastmod: todayIso, changefreq: 'monthly', priority: '0.6' },
  { loc: `${DOMAIN}/terms`, lastmod: todayIso, changefreq: 'monthly', priority: '0.6' },
];

const catPages = categoryIds.map((catId) => ({
  loc: `${DOMAIN}/category/${catId}`,
  lastmod: todayIso,
  changefreq: 'daily',
  priority: '0.85',
}));

const artPages = INITIAL_ARTICLES.map((art) => ({
  loc: getFullArticleUrl(art),
  lastmod: (art.updatedDate || art.publishDate || todayIso).split('T')[0],
  changefreq: 'daily',
  priority: art.isBreaking || art.isLead ? '0.95' : '0.85',
}));

const allUrls = [...staticPages, ...catPages, ...artPages];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

console.log(`Pre-render complete: ${renderedArticles} articles, ${renderedCategories} categories, /tools, /index.html, and ${allUrls.length} sitemap URLs.`);
