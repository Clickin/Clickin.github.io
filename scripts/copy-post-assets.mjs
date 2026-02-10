import fs from "node:fs";
import path from "node:path";

const postsDir = path.join(process.cwd(), "src", "content", "posts");
const outDir = path.join(process.cwd(), "public", "posts");

const isAsset = (name) => {
  const lower = name.toLowerCase();
  if (lower === "index.mdx") return false;
  if (lower.startsWith(".")) return false;
  return true;
};

function rmrf(p){ if (fs.existsSync(p)) fs.rmSync(p, { recursive:true, force:true }); }
function ensure(p){ fs.mkdirSync(p, { recursive:true }); }

function copyDir(src, dst){
  ensure(dst);
  for (const e of fs.readdirSync(src, { withFileTypes:true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) { copyDir(s, d); continue; }
    if (e.isFile() && isAsset(e.name)) { ensure(path.dirname(d)); fs.copyFileSync(s, d); }
  }
}

if (fs.existsSync(postsDir)) {
  rmrf(outDir); ensure(outDir);
  for (const dirent of fs.readdirSync(postsDir, { withFileTypes:true }).filter(d=>d.isDirectory())) {
    const slug = dirent.name;
    const folder = path.join(postsDir, slug);
    if (fs.existsSync(path.join(folder, "index.mdx"))) copyDir(folder, path.join(outDir, slug));
  }
  console.log("[copy-post-assets] done");
}
