export const site = {
  title: "Clickin Devlog",
  description: "Personal developer notes and write-ups.",
  language: "ko",
  author: "Clickin",
};

export const giscus = {
  enabled: true, // Set to true after configuring your Giscus repo below
  repo: "Clickin/Clickin.github.io", // ← e.g. "username/blog-comments"
  repoId: "MDEwOlJlcG9zaXRvcnkxMDI4MTM1MDU=", // ← From giscus.app
  category: "Announcements",
  categoryId: "DIC_kwDOBiDPQc4C2JNb", // ← From giscus.app
  mapping: "pathname" as const,
};
