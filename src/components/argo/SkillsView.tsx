// Created: 2026-04-30
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useArgo } from '@/context/ArgoContext';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'org' | 'groups';

export function SkillsView() {
  const { skills, activeSkillId, setActiveSkillId, setRightPanelView } = useArgo();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');

  const orgCount    = skills.filter(s => s.scope === 'org').length;
  const groupsCount = skills.filter(s => s.scope === 'group').length;

  const filtered = useMemo(() => {
    let list = skills;
    if (filter === 'org')    list = list.filter(s => s.scope === 'org');
    if (filter === 'groups') list = list.filter(s => s.scope === 'group');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return list;
  }, [skills, filter, search]);

  function handleSelectSkill(id: string) {
    setActiveSkillId(id);
    setRightPanelView('skill');
  }

  const pills: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all',    label: 'All',    count: skills.length },
    { key: 'org',    label: 'Org',    count: orgCount },
    { key: 'groups', label: 'Groups', count: groupsCount },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">Skills</h1>
        <p className="text-sm text-muted-foreground mt-1">All skills assigned to you.</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg mb-4">
        <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={e => { setSearch(e.target.value); }}
          className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Filter pills + count */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1">
          {pills.map(p => (
            <button
              key={p.key}
              onClick={() => setFilter(p.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                filter === p.key
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {search || filter !== 'all'
            ? `Showing ${filtered.length} of ${skills.length} skills`
            : `${skills.length} skills`}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm font-medium text-foreground">No skills found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(skill => (
            <button
              key={skill.id}
              onClick={() => handleSelectSkill(skill.id)}
              className={cn(
                "text-left border rounded-xl p-4 transition-colors",
                activeSkillId === skill.id
                  ? "bg-accent border-primary/30"
                  : "bg-card border-border hover:bg-accent/50"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-sm font-medium text-foreground leading-snug">{skill.name}</span>
                <span className="shrink-0 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {skill.scope === 'org' ? 'Org' : skill.group}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{skill.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
