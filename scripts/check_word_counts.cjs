const fs = require('fs');

function checkFile(file) {
  if (!fs.existsSync(file)) {
    console.log('Not found:', file);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  const items = content.split(/id:\s*'/).slice(1);
  console.log('=== ' + file + ' (' + items.length + ' articles) ===');
  items.forEach(it => {
    const id = it.split("'")[0];
    const country = (it.match(/country:\s*'([^']+)'/) || [])[1];
    const m = it.match(/content:\s*`([\s\S]*?)`,\s*\n\s*leadImage/);
    const text = m ? m[1] : '';
    const words = text.replace(/<[^>]*>/g, ' ').replace(/[#*`\-]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    console.log(`[${country}] ${id}: ${words} words`);
  });
}

checkFile('./src/data/articlesArabMaghrebTrending.ts');
checkFile('./src/data/articlesArabMashreqTrending.ts');
checkFile('./src/data/articlesArabGulfTrending.ts');
checkFile('./src/data/articlesArabNileRedSeaTrending.ts');
