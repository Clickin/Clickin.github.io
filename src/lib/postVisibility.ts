type PostVisibilityData = {
  draft: boolean;
  publish?: boolean;
};

export function isPostVisible(data: PostVisibilityData): boolean {
  return !data.draft && (import.meta.env.DEV || data.publish !== false);
}
