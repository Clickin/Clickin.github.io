export const postUrl=(s:string)=>`/blog/${encodeURIComponent(s.replace(/\/index$/, ''))}/`;
export const normalizePostSlug=(s:string)=>s.replace(/\/index$/, '');
