const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function pack() {
  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist');
    return;
  }

  const zip = new JSZip();

  function addDirToZip(currentDir, relativePath = '') {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      if (file.endsWith('.zip')) continue;
      const fullPath = path.join(currentDir, file);
      const relPath = relativePath ? `${relativePath}/${file}` : file;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addDirToZip(fullPath, relPath);
      } else {
        const content = fs.readFileSync(fullPath);
        zip.file(relPath, content);
      }
    }
  }

  addDirToZip(distDir);

  // Add helpful README.txt for Vercel
  zip.file('README-VERCEL-DEPLOY.txt', `المغرب العربي اليوم - تحديث مقالات الطبخ والأخبار
===================================================
تاريخ التحديث: 23 أكتوبر 2026

كيفية نشر هذا التحديث على Vercel لدومين almaghreb-alyoum.com:

الطريقة 1 (عبر Vercel Dashboard):
1. اذهب إلى https://vercel.com/dashboard وافتح مشروعك: almaghreb-alyoum
2. اضغط على Deployments -> Redeploy (أو ارفع محتويات هذا المجلد مباشرة)

الطريقة 2 (إذا كان مشروعك مربوطاً بـ GitHub):
1. انسخ ملفات التحديث إلى مستودع GitHub الخاص بك.
2. قم بعمل:
   git add .
   git commit -m "تحديث مقالات الطبخ ووصفات المطبخ المغربي 23 أكتوبر"
   git push origin main
3. سيقوم Vercel بالنشر التلقائي فوراً!

جميع مقالات الطبخ تم تحديثها بالصور الأصلية الحصرية وتاريخ اليوم.`);

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const publicDest = path.resolve(__dirname, '../public/almaghreb-alyoum-build.zip');
  const distDest = path.resolve(__dirname, '../dist/almaghreb-alyoum-build.zip');

  fs.writeFileSync(publicDest, buffer);
  fs.writeFileSync(distDest, buffer);

  console.log(`Successfully created ZIP: ${publicDest} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

pack().catch(console.error);
