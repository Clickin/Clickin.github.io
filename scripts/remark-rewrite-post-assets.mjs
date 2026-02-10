import { visit } from "unist-util-visit";
import path from "node:path";

export default function remarkRewritePostAssets() {
  return (tree, file) => {
    const fp = file?.path ? String(file.path) : "";
    const parts = fp.split(path.sep);
    const postsIdx = parts.lastIndexOf("posts");
    const slug = (postsIdx >= 0 && parts.length > postsIdx + 1) ? parts[postsIdx + 1] : null;
    if (!slug) return;

    const rewrite = (url) => {
      if (!url || typeof url !== "string") return url;
      if (url.startsWith("/") || url.startsWith("#")) return url;
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) return url;
      const [base, suffix] = url.split(/(?=[?#])/);
      const clean = base.replace(/^\.\//, "");
      return `/posts/${encodeURIComponent(slug)}/${clean}${suffix ?? ""}`;
    };

    visit(tree, (node) => {
      if (node.type === "image" && typeof node.url === "string") node.url = rewrite(node.url);
      if (node.type === "link" && typeof node.url === "string") {
        const u = node.url;
        if (!u.startsWith("/") && !u.startsWith("#") && !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) {
          if (u.startsWith("./") || /\.(png|jpe?g|gif|webp|svg|pdf|zip|json|csv)([?#].*)?$/i.test(u)) node.url = rewrite(u);
        }
      }
    });
  };
}
