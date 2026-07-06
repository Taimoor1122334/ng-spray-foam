import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

// Recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Files to copy
const filesToCopy = [
  'index.html',
  'about.html',
  'services.html',
  'service-details.html',
  'gallery.html',
  'testimonials.html',
  'faq.html',
  'contact.html'
];

filesToCopy.forEach(file => {
  const srcPath = path.join(process.cwd(), file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
    console.log(`Copied ${file} to dist/`);
  } else {
    console.warn(`Warning: ${file} does not exist yet.`);
  }
});

// Recursively copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(path.join(process.cwd(), 'assets'), path.join(distDir, 'assets'));
console.log('Assets directory copied to dist/assets');
console.log('Static site build complete!');
