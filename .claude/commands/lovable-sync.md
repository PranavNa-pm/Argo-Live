---
description: Run after pulling changes from Lovable to detect regressions — Lovable sometimes reintroduces patterns that have been intentionally replaced. Checks for tables, pagination, hardcoded colors, mobile breakpoints, and other known drift patterns.
---

# Lovable Sync Check

Run after pulling or merging Lovable changes. Detects design drift introduced by Lovable's AI generation.

## Step 1 — See what changed
```
git diff main...HEAD --name-only
```
Or if already merged: `git diff HEAD~1 --name-only`

Read every changed file in `src/components/argo/`.

## Step 2 — Check for known Lovable regressions

For each changed file, scan for these known patterns Lovable tends to reintroduce:

### ❌ Tables replacing borderless lists
- Flag: `<table`, `<thead`, `<tbody`, `<tr`, `<td`, `<th`
- Expected: `<button` rows with `hover:bg-black/5`

### ❌ Pagination replacing infinite scroll
- Flag: `setPage(`, `currentPage`, `totalPages`, `PAGE_SIZE`, "Load more" buttons with onClick
- Expected: `IntersectionObserver`, `displayCount`, `sentinelRef`

### ❌ Mobile breakpoints
- Flag: any class containing `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Argo is desktop-only — no responsive breakpoints anywhere

### ❌ Hardcoded colors
- Flag: `#[0-9a-fA-F]{3,6}`, `rgb(`, `bg-blue-`, `bg-gray-`, `bg-slate-`, `text-gray-`
- Expected: token classes only (`bg-primary`, `text-muted-foreground`, etc.)

### ❌ Type filter dropdowns for artifacts
- Flag: filter by Markdown / HTML / PPTX / type in artifact views
- Expected: no type filter — only context filters (All / General Chat / Projects)

### ❌ Visibility text badges
- Flag: text "Private" or "Shared" as a pill/badge next to project names
- Expected: `Globe` or `Lock` icon only

### ❌ Row background cards
- Flag: `bg-card` or `shadow-sm` on list row buttons
- Expected: `hover:bg-black/5` only — no base background on rows

### ❌ Search chat bar in main content area
- Flag: a search input inside the `ChatView` component
- Expected: chat search only in sidebar — not in the chat content area

### ❌ PanelHeader reintroduced
- Flag: `<PanelHeader` or a `function PanelHeader` — this was intentionally removed
- Expected: no header bar on content pages

### ❌ `export default` on argo components
- Flag: `export default function` in `src/components/argo/`
- Expected: named exports only (`export function ComponentName`)

## Step 3 — Report findings

For each regression found:
- File and line number
- What pattern was reintroduced
- What the correct pattern is

Then: **PASS** (no regressions) or **FAIL** with list of issues to fix.

## Step 4 — Fix or flag
If regressions are found, ask: "Fix automatically or flag for manual review?"
- Auto-fix: straightforward replacements (table → list, export default → named export)
- Flag: structural changes (pagination removal needs logic rewrite)
