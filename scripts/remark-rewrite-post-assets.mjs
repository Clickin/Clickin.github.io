import path from "node:path";

export default function satteriRewritePostAssets() {
  return {
    name: "rewrite-post-assets",
    image(node, ctx) {
      const fp = ctx.fileURL?.pathname ?? "";
      const parts = fp.split(path.sep);
      const postsIdx = parts.lastIndexOf("posts");
      const slug = (postsIdx >= 0 && parts.length > postsIdx + 1) ? parts[postsIdx + 1] : null;
      if (!slug || typeof node.url !== "string") return;
      ctx.setProperty(node, "url", rewritePostAssetUrl(node.url, slug));
    },
    link(node, ctx) {
      const fp = ctx.fileURL?.pathname ?? "";
      const parts = fp.split(path.sep);
      const postsIdx = parts.lastIndexOf("posts");
      const slug = (postsIdx >= 0 && parts.length > postsIdx + 1) ? parts[postsIdx + 1] : null;
      if (!slug || typeof node.url !== "string") return;
      if (node.url.startsWith("./") || /\.(png|jpe?g|gif|webp|svg|pdf|zip|json|csv)([?#].*)?$/i.test(node.url)) {
        ctx.setProperty(node, "url", rewritePostAssetUrl(node.url, slug));
      }
    },
  };
}

function rewritePostAssetUrl(url, slug) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("/") || url.startsWith("#")) return url;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) return url;
  const [base, suffix] = url.split(/(?=[?#])/);
  const clean = base.replace(/^\.\//, "");
  return `/posts/${encodeURIComponent(slug)}/${clean}${suffix ?? ""}`;
}
