import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = join(__dirname, '../.vscode');
const destDir = join(process.cwd(), '.vscode');

// Run from the consumer app root, never from inside the package itself
if (process.cwd() === join(__dirname, '..')) {
  console.log('⊘ Skipping snippet copy (run this from your app root, not the layer)');
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });

// Find and copy all .code-snippets files
try {
  const files = readdirSync(srcDir).filter(file => file.endsWith('.code-snippets'));

  if (files.length === 0) {
    console.log('⊘ No snippet files found');
    process.exit(0);
  }

  files.forEach(file => {
    try {
      copyFileSync(join(srcDir, file), join(destDir, file));
      console.log(`✓ Copied VSCode snippet: ${file}`);
    } catch (err) {
      console.warn(`⚠ Failed to copy ${file}:`, err.message);
    }
  });

  console.log(`✓ VSCode snippets installed to .vscode/`);
} catch (err) {
  console.warn('⚠ Snippet installation skipped:', err.message);
}
