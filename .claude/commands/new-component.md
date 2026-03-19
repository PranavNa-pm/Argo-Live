---
description: Scaffold a new Argo component following all established patterns — correct file structure, named export, isLoading skeleton, empty state, design tokens, hover states. Use whenever you need to create a new page or list view from scratch.
argument-hint: [ComponentName] [type: list|chat|detail|modal]
---

# New Argo Component

Scaffold a new component called $ARGUMENTS.

Parse the arguments: first word is the ComponentName (PascalCase), second word is the type (list, chat, detail, or modal). If type is missing, infer from the name.

---

## Step 1 — Determine the file path
- List/page views: `src/components/argo/[ComponentName].tsx`
- Modals: `src/components/argo/[ComponentName]Modal.tsx` if not already named with Modal
- Check the file doesn't already exist

## Step 2 — Add date comment at the top
First line of the file (after imports) must be:
```typescript
// Created: [run `date "+%Y-%m-%d"` to get today's date]
// Component: [ComponentName]
// Type: [list | chat | detail | modal]
```

## Step 3 — Scaffold based on type

**For `list` type** (Projects/Artifacts style):
```tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useArgo } from '@/context/ArgoContext';
import { ListRowSkeleton } from '@/components/argo/skeletons/ListRowSkeleton';
import { cn } from '@/lib/utils';

// Created: [DATE]
// Component: [ComponentName]
// Type: list

export function [ComponentName]() {
  const { isLoading } = useArgo();
  const [search, setSearch] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [displayCount, setDisplayCount] = useState(20);

  const items: any[] = []; // TODO: connect to context or props
  const filtered = items.filter(i => !search || i.name?.toLowerCase().includes(search.toLowerCase()));
  const visible = filtered.slice(0, displayCount);
  const hasFilter = !!search;

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || filtered.length <= displayCount) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setDisplayCount(prev => prev + 20);
    }, { threshold: 0.1 });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filtered.length, displayCount]);

  return (
    <div className="w-full p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">[ComponentName]</h2>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-border rounded-lg">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setDisplayCount(20); }}
            placeholder="Search..."
            className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none" />
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground">
          {hasFilter ? `Showing ${filtered.length} of ${items.length} items` : `${items.length} items`}
        </p>

        {/* List */}
        {isLoading ? (
          // DEMO ONLY — replace isLoading with real async state when connecting backend
          <div className="space-y-1">{[...Array(4)].map((_, i) => <ListRowSkeleton key={i} />)}</div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {hasFilter ? 'No items match your search' : 'No items yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {visible.map((item, i) => (
              <button key={i} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-black/5 transition-colors text-left group">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</div>
                </div>
              </button>
            ))}
            {filtered.length > displayCount && <div ref={sentinelRef} className="h-4" />}
          </div>
        )}
      </div>
    </div>
  );
}
```

**For `modal` type**: scaffold a focused modal with header, scrollable body, footer (Cancel + primary action). Follow the modal pattern in STYLE_GUIDE.md.

**For `detail` type**: scaffold a project-detail style page with a header, tabs (Tab 1 / Tab 2), and content area.

## Step 4 — Register in CenterPanel if needed
If this is a page-level view, ask whether to add a new `centerView` case in `CenterPanel.tsx`.

## Step 5 — Verify
Run `npm run build` and confirm no errors. Report the file path and date added.
