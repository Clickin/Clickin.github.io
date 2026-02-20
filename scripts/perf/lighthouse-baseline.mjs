import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';

const BASE_URL = process.argv[2] || 'http://localhost:4321';
const OUTPUT_DIR = '.sisyphus/evidence/task-1';
const LIGHTHOUSE_VERSION = '13'; // Pin to version 13

/**
 * Discover a valid blog post slug deterministically.
 * Preferred: from dist/blog/[slug]/index.html
 * Fallback: from src/content/posts/[slug]/index.mdx
 */
function discoverBlogSlug() {
  const distBlogPath = path.join(process.cwd(), 'dist', 'blog');
  if (fs.existsSync(distBlogPath)) {
    const dirs = fs.readdirSync(distBlogPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
    if (dirs.length > 0) {
      console.log(`Discovered blog slug from dist: ${dirs[0]}`);
      return dirs[0];
    }
  }

  const srcPostsPath = path.join(process.cwd(), 'src', 'content', 'posts');
  if (fs.existsSync(srcPostsPath)) {
    const dirs = fs.readdirSync(srcPostsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
    if (dirs.length > 0) {
      console.log(`Discovered blog slug from src (fallback): ${dirs[0]}`);
      return dirs[0];
    }
  }

  throw new Error('Could not discover any blog posts.');
}

/**
 * Validate Lighthouse JSON output.
 */
function validateLighthouseJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    if (json.lighthouseVersion && json.categories) {
      return true;
    }
    console.error(`Validation failed for ${filePath}: Missing lighthouseVersion or categories.`);
    return false;
  } catch (error) {
    console.error(`Validation failed for ${filePath}: ${error.message}`);
    return false;
  }
}

const blogSlug = discoverBlogSlug();
const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'blog', path: `/blog/${blogSlug}/` },
  { name: 'search', path: '/search/' }
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Starting Lighthouse baseline run against ${BASE_URL}`);
console.log(`Output directory: ${OUTPUT_DIR}`);

// Check if server is reachable
try {
  console.log(`Checking if ${BASE_URL} is reachable...`);
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }
  console.log(`✅ Server is reachable.`);
} catch (error) {
  console.error(`❌ Error: Could not reach server at ${BASE_URL}. Make sure 'pnpm preview' is running.`);
  console.error(error.message);
  process.exit(1);
}

let allSucceeded = true;

for (const route of ROUTES) {
  const url = new URL(route.path, BASE_URL).toString();
  const outputPath = path.join(OUTPUT_DIR, `${route.name}-baseline.json`);
  
  console.log(`\n--- Running Lighthouse for ${url} ---`);
  
  // Using npx lighthouse@13 to pin version
  const args = [
    `-y`, `lighthouse@${LIGHTHOUSE_VERSION}`,
    url,
    `--output=json`,
    `--output-path=${outputPath}`,
    `--quiet`,
    `--chrome-flags=--headless --no-sandbox`,
    `--only-categories=performance,accessibility,best-practices,seo`
  ];
  
  console.log(`Executing: npx ${args.join(' ')}`);
  
  const result = spawnSync('npx', args, { stdio: 'inherit', shell: true });
  
  if (result.status !== 0) {
    console.warn(`⚠️ Lighthouse exited with non-zero status (${result.status}) for ${url}.`);
    // Check if it's just a cleanup error (EPERM) but output is valid
    if (fs.existsSync(outputPath) && validateLighthouseJson(outputPath)) {
      console.log(`✅ Output JSON exists and is valid. Treating as success despite exit code.`);
    } else {
      console.error(`❌ Failed to generate valid Lighthouse report for ${url}.`);
      allSucceeded = false;
    }
  } else {
    if (fs.existsSync(outputPath) && validateLighthouseJson(outputPath)) {
      console.log(`✅ Saved ${route.name} baseline to ${outputPath}`);
    } else {
      console.error(`❌ Output file ${outputPath} was not created or is invalid.`);
      allSucceeded = false;
    }
  }
}

if (allSucceeded) {
  console.log('\nLighthouse baseline run completed successfully.');
  process.exit(0);
} else {
  console.error('\nLighthouse baseline run failed for one or more routes.');
  process.exit(1);
}
