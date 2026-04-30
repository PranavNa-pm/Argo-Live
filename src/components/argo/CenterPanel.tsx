import React, { useState } from 'react';
import {
  Plus, Globe, ChevronDown, ChevronRight, Search, Copy, AlertCircle,
} from 'lucide-react';
import { useArgo } from '@/context/ArgoContext';
import { cn } from '@/lib/utils';
import { ConfigView } from '@/components/argo/ConfigView';
import { ArtifactsTable } from '@/components/argo/ArtifactsTable';
import { SpaceWorkspaceView } from '@/components/argo/SpaceWorkspaceView';
import { WorkspaceDashboard } from '@/components/argo/WorkspaceDashboard';
import { ChatView } from '@/components/argo/ChatView';
import { SkillsView } from '@/components/argo/SkillsView';
import { CreateProjectModal } from '@/components/argo/CreateProjectModal';
import { JoinProjectModal } from '@/components/argo/JoinProjectModal';

// ─── Create Project View (Join + Create) ─────────────────────

function CreateSpaceView() {
  const { createSpace, setCenterView } = useArgo();

  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectContext, setProjectContext] = useState('');
  const [showContextExamples, setShowContextExamples] = useState(false);
  const [shareable, setShareable] = useState(false);
  const [shareSearch, setShareSearch] = useState('');

  const shareMembers = [
    { name: 'John Smith', role: 'Pre-Sales Team', selected: false },
    { name: 'Sarah Lee', role: 'Delivery Manager Team', selected: false },
    { name: 'James Wilson', role: 'Pre-Sales Admin', selected: false },
    { name: 'Alex Thompson', role: 'Admin', selected: false },
  ];

  const filteredMembers = shareSearch
    ? shareMembers.filter(m => m.name.toLowerCase().includes(shareSearch.toLowerCase()))
    : shareMembers;

  const handleJoin = () => {
    if (!joinCode.trim()) {
      setJoinError('Please enter a project link or access code.');
      return;
    }
    const isValid = joinCode.includes('argo.app/project/') || joinCode.length >= 8;
    if (!isValid) {
      setJoinError('Invalid project link or access code. Please check and try again.');
    } else {
      setJoinError('');
      setCenterView('projects');
    }
  };

  const handleCreate = () => {
    if (name.trim()) {
      createSpace(name.trim(), description.trim() || undefined, projectContext.trim() || undefined);
    }
  };

  const handleCancel = () => {
    setCenterView('projects');
  };

  return (
    <div className="w-full p-6 space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Create Project</h1>
        <p className="text-sm text-muted-foreground mt-1">Join an existing project or create a new one.</p>
      </div>

      {/* ── Section 1: Join a Project ── */}
      <div className="p-5 rounded-lg border border-border bg-secondary/10 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Join a Project</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Paste a shared project link or access code to join.</p>
        </div>
        <div>
          <input
            value={joinCode}
            onChange={e => { setJoinCode(e.target.value); setJoinError(''); }}
            placeholder="Enter project access code or link"
            className={cn("w-full text-sm bg-background border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring", joinError ? "border-destructive" : "border-border")}
          />
          <p className="text-[10px] text-muted-foreground mt-1">Anyone using this link must log in to Argo to access the project.</p>
          {joinError && (
            <div className="flex items-center gap-1.5 mt-1.5 animate-fade-in">
              <AlertCircle className="w-3 h-3 text-destructive shrink-0" />
              <p className="text-xs text-destructive">{joinError}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleJoin}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Join
        </button>
      </div>

      {/* Visual separator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground font-medium">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* ── Section 2: Create a New Project ── */}
      <div className="p-5 rounded-lg border border-border bg-secondary/10 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Create a New Project</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Set up a new project with its own chats, files, and AI context.</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Project Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Client Name — Q1 Proposal"
              className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Project Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of this project…"
              rows={3}
              className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <p className="text-[10px] text-muted-foreground mt-1">This description is visible to project members.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Project Context <span className="text-muted-foreground/60">(optional)</span></label>
            <textarea
              value={projectContext}
              onChange={e => setProjectContext(e.target.value)}
              placeholder="Add context about this project…"
              rows={5}
              className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <p className="text-[10px] text-muted-foreground mt-1">This helps Argo understand the purpose of the project.</p>
            <button
              type="button"
              onClick={() => setShowContextExamples(!showContextExamples)}
              className="text-xs text-primary hover:underline mt-1.5 flex items-center gap-1 font-medium"
            >
              {showContextExamples ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              See examples
            </button>
            {showContextExamples && (
              <div className="mt-2 p-3 rounded-md bg-secondary/30 border border-border text-xs text-muted-foreground space-y-3 animate-fade-in">
                <div>
                  <p className="font-semibold text-foreground/80 mb-1">Client project</p>
                  <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed">{'Client:\nIndustry:\nGoal:\nNotes:'}</pre>
                </div>
                <div className="border-t border-border pt-2">
                  <p className="font-semibold text-foreground/80 mb-1">Task or automation workspace</p>
                  <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed">{'Task:\nGoal:\nWorkflow:\nNotes:'}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Share Toggle */}
          <div className="border-t border-border pt-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={shareable}
                onClick={() => setShareable(!shareable)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                  shareable ? "bg-primary" : "bg-secondary"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
                  shareable ? "translate-x-4" : "translate-x-0"
                )} />
              </button>
              <span className="text-sm font-medium text-foreground">Make this project shareable</span>
            </label>
          </div>

          {shareable && (
            <div className="space-y-4 p-4 rounded-lg border border-border bg-secondary/20 animate-fade-in">
              <div>
                <div className="text-xs font-semibold text-foreground mb-1.5">Share via Link</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-2.5 py-1.5 bg-secondary/50 border border-border rounded-md text-xs text-muted-foreground font-mono truncate">
                    https://argo.app/project/new-project
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText('https://argo.app/project/new-project')}
                    className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    title="Copy link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Anyone with this link must log in to view the project.</p>
              </div>

              <div className="border-t border-border" />

              <div className="opacity-50 pointer-events-none select-none" title="Coming after MVP">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-foreground">Share with Members</div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Coming soon</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-border rounded-lg mb-2">
                  <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <input
                    value={shareSearch}
                    onChange={() => {}}
                    placeholder="Search by name..."
                    className="flex-1 text-xs bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                    readOnly
                  />
                </div>
                <div className="space-y-1">
                  {filteredMembers.map(m => (
                    <label key={m.name} className="flex items-center gap-2 text-sm text-foreground cursor-default py-1">
                      <input type="checkbox" defaultChecked={m.selected} className="rounded border-border" readOnly />
                      <span className="flex-1">{m.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{m.role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              name.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
          >
            Create Project
          </button>
          <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main CenterPanel ────────────────────────────────────────

function CollapsedTopBar() {
  return null;
}

export function CenterPanel() {
  const { centerView, adminTab } = useArgo();

  const wrap = (children: React.ReactNode) => (
    <div className="flex-1 flex flex-col h-screen bg-background min-w-0 overflow-y-auto argo-scrollbar">
      <CollapsedTopBar />
      {children}
    </div>
  );

  if (centerView === 'config') return wrap(<ConfigView tab={adminTab} />);
  if (centerView === 'artifacts-table') return wrap(<ArtifactsTable />);
  if (centerView === 'new-space') return wrap(<CreateSpaceView />);
  if (centerView === 'projects') return wrap(<WorkspaceDashboard />);
  if (centerView === 'space-workspace') return wrap(<SpaceWorkspaceView />);
  if (centerView === 'skills') return wrap(<SkillsView />);

  // ChatView has its own header — don't double-wrap
  return (
    <div className="flex-1 flex flex-col h-screen bg-background min-w-0">
      <CollapsedTopBar />
      <ChatView />
    </div>
  );
}
