// Created: 2026-04-30
import { useRef, useEffect, useState, useCallback } from 'react';
import { X, Wrench } from 'lucide-react';
import { useArgo } from '@/context/ArgoContext';
import { cn } from '@/lib/utils';

type AnchorSection = 'description' | 'instructions' | 'tools' | 'references' | 'assets';

const SECTION_KEYS: AnchorSection[] = ['description', 'instructions', 'tools', 'references', 'assets'];

const SECTION_LABELS: Record<AnchorSection, string> = {
  description:  'Description',
  instructions: 'Instructions',
  tools:        'Tools',
  references:   'References',
  assets:       'Assets',
};

/** Returns offsetTop of el relative to ancestor container, traversing offsetParent chain. */
function relativeOffsetTop(el: HTMLElement, container: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

export function SkillDetailPanel() {
  const { skills, activeSkillId, setActiveSkillId, setRightPanelView } = useArgo();
  const skill = skills.find(s => s.id === activeSkillId);

  const scrollRef       = useRef<HTMLDivElement>(null);
  const descriptionRef  = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const toolsRef        = useRef<HTMLDivElement>(null);
  const referencesRef   = useRef<HTMLDivElement>(null);
  const assetsRef       = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<AnchorSection>('description');

  // Reset scroll + active section when skill changes
  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = 0;
    setActiveSection('description');
  }, [skill?.id]);

  // Scroll listener — compares scrollTop to precomputed offsets.
  // References individual useRef vars directly (not a refs map) to avoid stale closure.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !skill) return;

    function onScroll() {
      // 40% threshold: sections become active when in upper portion of visible area
      // (handles short content at end that can't scroll all the way to top)
      const st = container.scrollTop + container.clientHeight * 0.4;
      const pairs: [AnchorSection, HTMLDivElement | null][] = [
        ['description',  descriptionRef.current],
        ['instructions', instructionsRef.current],
        ['tools',        toolsRef.current],
        ['references',   referencesRef.current],
        ['assets',       assetsRef.current],
      ];
      let active: AnchorSection = 'description';
      for (const [key, el] of pairs) {
        if (el && relativeOffsetTop(el, container) <= st) active = key;
      }
      setActiveSection(active);
    }

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [skill?.id]);

  const scrollTo = useCallback((section: AnchorSection) => {
    const map: Record<AnchorSection, React.RefObject<HTMLDivElement>> = {
      description:  descriptionRef,
      instructions: instructionsRef,
      tools:        toolsRef,
      references:   referencesRef,
      assets:       assetsRef,
    };
    map[section].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [descriptionRef, instructionsRef, toolsRef, referencesRef, assetsRef]);

  function handleClose() {
    setActiveSkillId(null);
    setRightPanelView('empty');
  }

  if (!skill) return null;

  return (
    <div className="w-[440px] min-w-[440px] border-l border-border flex flex-col h-screen bg-background animate-slide-in-right">

      {/* Header — no bottom border, flows directly into anchor nav */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-semibold text-foreground">{skill.name}</h2>
            <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {skill.scope === 'org' ? 'Org' : skill.group}
            </span>
          </div>
        </div>
        <button
          title="Close"
          onClick={handleClose}
          className="shrink-0 ml-3 mt-0.5 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Anchor nav */}
      <div className="flex items-center px-5 border-b border-border shrink-0">
        {SECTION_KEYS.map(key => (
          <button
            key={key}
            onClick={() => scrollTo(key)}
            className={cn(
              "py-2.5 mr-4 text-xs font-medium transition-colors border-b-2 -mb-px",
              activeSection === key
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            {SECTION_LABELS[key]}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto argo-scrollbar relative">
        <div className="px-5 py-5 space-y-8">

          {/* Description */}
          <div ref={descriptionRef}>
            <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">Description</h3>
            <p className="text-sm text-foreground leading-relaxed">{skill.description}</p>
          </div>

          {/* Instructions */}
          <div ref={instructionsRef}>
            <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">Instructions</h3>
            {skill.instructions ? (
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap bg-secondary/50 rounded-lg p-4 border border-border">
                {skill.instructions}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">No instructions defined.</p>
            )}
          </div>

          {/* Tools */}
          <div ref={toolsRef}>
            <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">Tools</h3>
            {skill.tools && skill.tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skill.tools.map(tool => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground"
                  >
                    <Wrench className="w-3.5 h-3.5 shrink-0" />
                    {tool.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No tools configured.</p>
            )}
          </div>

          {/* References */}
          <div ref={referencesRef}>
            <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">References</h3>
            {skill.references && skill.references.length > 0 ? (
              <div className="space-y-1.5">
                {skill.references.map((ref, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card px-4 py-2.5">
                    <p className="text-xs font-medium text-foreground">{ref.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No references linked.</p>
            )}
          </div>

          {/* Assets */}
          <div ref={assetsRef}>
            <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-3">Assets</h3>
            {skill.assets && skill.assets.length > 0 ? (
              <div className="space-y-1.5">
                {skill.assets.map((asset, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card px-4 py-2.5">
                    <p className="text-xs font-medium text-foreground">{asset.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No assets attached.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
