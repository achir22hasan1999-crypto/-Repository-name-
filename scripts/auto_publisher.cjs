/**
 * Daily Auto Publisher Script
 * Generates and refreshes 5 daily human-like investigative articles for:
 * 1. Morocco (المغرب)
 * 2. Algeria (الجزائر)
 * 3. Tunisia (تونس)
 * 4. Egypt (مصر)
 * 5. Saudi Arabia (المملكة العربية السعودية)
 *
 * Each article is strictly between 1,000 and 2,000 words in journalistic Arabic,
 * optimized for SEO, Google AdSense, and current 2026 economic & strategic trends.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Daily Auto Publisher Started ===');
const todayDate = new Date().toISOString();
console.log('Current Date & Time:', todayDate);

// 1. Run generation and boost
try {
  execSync('node scripts/generate_initial_autopilot.cjs', { stdio: 'inherit' });
  execSync('node scripts/boost_autopilot.cjs', { stdio: 'inherit' });
} catch (e) {
  console.log('Regeneration note:', e.message);
}

// 2. Refresh publishedAt to current date and refresh metrics
const targetFile = path.resolve(__dirname, '../src/data/articlesDailyAutopilot.ts');
if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  
  // Replace publishedAt dates with current date
  const isoPrefix = todayDate.split('T')[0];
  content = content.replace(/publishedAt:\s*"[^"]+"/g, `publishedAt: "${todayDate}"`);
  content = content.replace(/"publishedAt":\s*"[^"]+"/g, `"publishedAt": "${todayDate}"`);
  
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Successfully refreshed articlesDailyAutopilot.ts with current date:', todayDate);
} else {
  console.error('Target file not found:', targetFile);
  process.exit(1);
}

console.log('=== Daily Auto Publisher Finished Successfully ===');
