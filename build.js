// Build script – assembles section HTML files into index.html
const fs   = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, 'sections');
const INDEX_FILE   = path.join(__dirname, 'index.html');

const sectionsOrder = [
  'sidebar',
  'hero',
  'about',
  'services',
  'experience',
  'projects',
  'skills',
  'certifications',
  'testimonials',
  'contact',
  'footer'
];

console.log('Assembling portfolio sections...\n');

let allFound = true;
sectionsOrder.forEach((sec) => {
  const file = path.join(SECTIONS_DIR, sec, `${sec}.html`);
  if (fs.existsSync(file)) {
    console.log(`  ✅  ${sec}`);
  } else {
    console.warn(`  ⚠️  Missing: sections/${sec}/${sec}.html`);
    allFound = false;
  }
});

if (allFound) {
  console.log('\nAll section files found. Ready to build.');
} else {
  console.log('\nSome section files are missing.');
}
