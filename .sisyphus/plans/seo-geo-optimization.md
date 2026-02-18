# Work Plan: SEO & GEO Optimization (clickin.github.io)

## TL;DR

> **Quick Summary**: Implement Google Search Console verification via HTTP file, fix site configuration, and establish a GEO-friendly "Projects" section with JSON-LD and `llms.txt`.
>
> **Deliverables**:
> - GSC Verification File (`public/google[code].html`)
> - Fixed `astro.config.mjs` (Base URL)
> - New `src/pages/projects.astro` with `SoftwareApplication` schema
> - Updated `Header.astro` navigation
> - `public/llms.txt` for AI discovery
>
> **Estimated Effort**: Short
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Config Fix → Projects Page → GSC Verification

---

## Context

### Original Request
- Improve SEO/GEO for GitHub Pages blog and sub-projects (`CBXShell-rs`, `stax-xml`).
- Constraint: No DNS access (must use HTTP verification).
- Requirements: HTML file verification, sub-project linking, GEO optimization.

### Interview Decisions
- **Verification**: Option A (HTML file upload).
- **Structure**: New "Projects" page/section for linking sub-projects.
- **GEO**: JSON-LD schema + `llms.txt`.

### Metis Review
- **Confirmed**: Separate `projects.astro` page is best for SEO/GEO.
- **Gap Identified**: Missing actual GSC filename (needs placeholder).
- **Gap Identified**: Missing project descriptions (needs placeholder/research).

---

## Work Objectives

### Core Objective
Enable search engines (Google) and answer engines (AI) to correctly index and understand the relationship between the main blog and its sub-projects.

### Concrete Deliverables
- [x] `public/google[code].html` (GSC verification)
- [x] `src/pages/projects.astro` (Projects listing)
- [x] `public/llms.txt` (AI map)
- [x] Updated `astro.config.mjs` (Correct site URL)

### Definition of Done
- [x] `npm run build` succeeds without errors.
- [x] `dist/google[code].html` exists.
- [x] `dist/projects/index.html` contains JSON-LD schema.
- [x] `dist/llms.txt` exists.

### Must Have
- `SoftwareApplication` schema for projects.
- Valid links to sub-projects (`/CBXShell-rs/`, etc.).
- Correct canonical URLs in `astro.config.mjs`.

### Must NOT Have
- Hardcoded absolute URLs for internal links (use `import.meta.env.BASE_URL`).
- Broken navigation (check mobile/desktop).

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES (Astro build)
- **Automated tests**: NO (None existing) -> **Agent-Executed QA Only**.
- **QA Tool**: `curl` (API/File check) + `grep` (Content check).

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool | Method |
|------------------|-------------------|--------|
| Config/Build | Bash | `npm run build` + check output files |
| HTML Content | Bash (grep) | Check for specific tags/text in build output |
| JSON-LD | Bash (grep/jq) | Validate schema structure in HTML |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Configuration & Structure):
├── Task 1: Fix Astro Configuration [quick]
├── Task 2: Create Projects Page & Schema [visual-engineering]
├── Task 3: Update Header Navigation [quick]
└── Task 4: Create llms.txt [writing]

Wave 2 (Verification & Finalization):
├── Task 5: Add GSC Verification File [quick]
└── Task 6: Final Build & SEO Audit [unspecified-high]

Critical Path: Task 1 → Task 2 → Task 5 → Task 6
Parallel Speedup: ~50%
Max Concurrent: 4
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | — | 6 | 1 |
| 2 | — | 6 | 1 |
| 3 | — | 6 | 1 |
| 4 | — | 6 | 1 |
| 5 | — | 6 | 2 |
| 6 | 1, 2, 3, 4, 5 | — | 2 |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks → Agent Category |
|------|------------|----------------------|
| 1 | **4** | T1 → `quick`, T2 → `visual-engineering`, T3 → `quick`, T4 → `writing` |
| 2 | **2** | T5 → `quick`, T6 → `unspecified-high` |

---

## TODOs

- [x] 1. Fix Astro Configuration

  **What to do**:
  - Update `astro.config.mjs` to set `site` to `https://clickin.github.io`.
  - Ensure `ghPagesConfig` function behaves correctly.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `git-master`

  **References**:
  - `astro.config.mjs:17` - The line to change.

  **QA Scenarios**:
  ```
  Scenario: Verify site URL config
    Tool: Bash
    Steps:
      1. grep "https://clickin.github.io" astro.config.mjs
    Expected Result: Match found
    Evidence: .sisyphus/evidence/task-1-config.txt
  ```

- [x] 2. Create Projects Page & Schema

  **What to do**:
  - Create `src/pages/projects.astro`.
  - Implement the layout using `BaseLayout`.
  - Define `projects` array with:
    - `CBXShell-rs` (Rust, CBX shell implementation)
    - `stax-xml` (TypeScript, XML parser - *verify actual desc if possible, else placeholder*)
  - Inject `SoftwareApplication` JSON-LD schema.
  - Style using Tailwind (match `blog/index.astro` style).

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `frontend-ui-ux`

  **References**:
  - `src/pages/blog/index.astro` - Style reference (cards).
  - `src/layouts/BaseLayout.astro` - Layout wrapper.

  **QA Scenarios**:
  ```
  Scenario: Check JSON-LD schema
    Tool: Bash
    Steps:
      1. npm run build
      2. grep "SoftwareApplication" dist/projects/index.html
      3. grep "CBXShell-rs" dist/projects/index.html
    Expected Result: Schema and content present
    Evidence: .sisyphus/evidence/task-2-schema.txt
  ```

- [x] 3. Update Header Navigation

  **What to do**:
  - Add "Projects" link to `src/components/Header.astro`.
  - Place it between "Blog" and "Resume" (or appropriate spot).
  - Use `base` variable for correct routing.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `frontend-ui-ux`

  **References**:
  - `src/components/Header.astro:13-16` - Existing nav links.

  **QA Scenarios**:
  ```
  Scenario: Verify link existence
    Tool: Bash
    Steps:
      1. grep 'href={`${base}projects/`}' src/components/Header.astro
    Expected Result: Link code found
    Evidence: .sisyphus/evidence/task-3-nav.txt
  ```

- [x] 4. Create llms.txt

  **What to do**:
  - Create `public/llms.txt`.
  - Follow the [llms.txt spec](https://llmstxt.org/) (Project name, summary, file structure).
  - Include links to:
    - Main blog (`/`)
    - Projects page (`/projects/`)
    - Sub-projects (`/CBXShell-rs/`, `/stax-xml/`)
    - RSS feed (`/rss.xml`)

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `git-master`

  **References**:
  - `src/site.config.ts` - Site metadata.

  **QA Scenarios**:
  ```
  Scenario: Verify llms.txt content
    Tool: Bash
    Steps:
      1. cat public/llms.txt
      2. grep "CBXShell-rs" public/llms.txt
    Expected Result: File exists and contains project links
    Evidence: .sisyphus/evidence/task-4-llms.txt
  ```

- [x] 5. Add GSC Verification File

  **What to do**:
  - **CRITICAL**: Ask user for the filename/code OR create a placeholder `public/google-verification-placeholder.html` with instructions.
  - *Decision*: Create `public/google[PLACEHOLDER].html` and a `.sisyphus/NEXT_STEPS.md` instructing user to rename it.
  - *Actually*, better to create a generic one and tell user to rename, OR just use `write` if user provides it.
  - *Plan*: Create `public/google_verification_instruction.html` (content: "Rename this file to google[code].html provided by GSC").
  - *Correction*: The prompt said "1. A". I will create a placeholder.

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **QA Scenarios**:
  ```
  Scenario: Check placeholder existence
    Tool: Bash
    Steps:
      1. ls public/google*.html
    Expected Result: File exists
    Evidence: .sisyphus/evidence/task-5-gsc.txt
  ```

- [x] 6. Final Build & SEO Audit

  **What to do**:
  - Run full production build (`npm run build`).
  - Verify `sitemap-0.xml` or `sitemap-index.xml` in `dist/`.
  - Check `robots.txt` in `dist/`.
  - Verify all new pages exist in `dist/`.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`

  **QA Scenarios**:
  ```
  Scenario: Full build verification
    Tool: Bash
    Steps:
      1. npm run build
      2. test -f dist/projects/index.html
      3. test -f dist/llms.txt
      4. grep "clickin.github.io" dist/sitemap-0.xml
    Expected Result: All checks pass
    Evidence: .sisyphus/evidence/task-6-audit.txt
  ```

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle`
  Check that `astro.config.mjs` has the correct domain. Check `projects.astro` has JSON-LD. Check `llms.txt` exists.

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build` to ensure no build errors. Check for broken links in `dist/`.

- [x] F3. **Real Manual QA** — `unspecified-high`
  Simulate a crawler: `curl localhost:4321/projects/` (preview mode) and check for schema.

- [x] F4. **Scope Fidelity Check** — `deep`
  Verify no extra pages created. Verify sub-projects are linked.

---

## Success Criteria

### Final Checklist
- [x] GSC file exists (or placeholder)
- [x] Projects page is live and linked
- [x] JSON-LD valid
- [x] llms.txt valid
