import React, { useState } from 'react';
import {
  Plus, Bot, Search, Eye, Copy, Trash2, Users,
  Pencil, ChevronDown, ChevronRight, BookOpen,
} from 'lucide-react';
import { useArgo, AGENTS } from '@/context/ArgoContext';
import { cn } from '@/lib/utils';
import type { AdminTab } from '@/types/argo';

// ─── Users Mapped Cell ───────────────────────────────────────

export function UsersMappedCell({ count, users }: { count: number; users: string[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-semibold text-primary hover:underline cursor-pointer"
      >
        {count}
      </button>
      {expanded && (
        <div className="mt-1.5 space-y-0.5 animate-fade-in">
          {users.map(u => (
            <div key={u} className="text-xs text-muted-foreground">{u}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ConfigView({ tab }: { tab: AdminTab }) {
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [agentSearch, setAgentSearch] = useState('');
  const defaultAgent = { name: '', description: '', prompt: '', model: 'gpt-4o', capabilities: [] as string[], agentType: 'system' as 'system' | 'shared', sharedWithRoles: [] as string[] };
  const [newAgent, setNewAgent] = useState(defaultAgent);
  const [showNewPrompt, setShowNewPrompt] = useState(false);
  const [expandedPromptIdx, setExpandedPromptIdx] = useState<number | null>(null);
  const [promptSearch, setPromptSearch] = useState('');

  if (tab === 'agents') {
    const filteredAgents = agentSearch
      ? AGENTS.filter(a => a.name.toLowerCase().includes(agentSearch.toLowerCase()))
      : AGENTS;

    const roleCounts: Record<string, number> = {
      'general': 10,
      'hr-agent': 6,
      'social-media-agent': 4,
      'it-support-agent': 5,
    };

    const availableRoles = ['Admin', 'All Users'];

    return (
      <div className="w-full p-6 space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Agent Configuration</h2>
          {!showAddAgent && !editingAgentId && (
            <button
              onClick={() => { setNewAgent(defaultAgent); setShowAddAgent(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Agent
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-border rounded-lg flex-1">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={agentSearch}
            onChange={e => setAgentSearch(e.target.value)}
            placeholder="Search agents..."
            className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {(showAddAgent || editingAgentId) && (
          <div className="p-5 rounded-lg border border-border bg-secondary/20 space-y-4 max-w-2xl animate-scale-in">
            <h3 className="text-sm font-semibold text-foreground">{editingAgentId ? 'Edit Agent' : 'Create New Agent'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Agent Name</label>
                <input value={newAgent.name} onChange={e => setNewAgent({ ...newAgent, name: e.target.value })} placeholder="e.g. Research Agent" className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Short Description</label>
                <input value={newAgent.description} onChange={e => setNewAgent({ ...newAgent, description: e.target.value })} placeholder="What does this agent do?" className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Prompt Template</label>
                  <select className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                    <option>Pre-Sales Prompt v1.2</option>
                    <option>Company Info Prompt v1.0</option>
                    <option>Custom Template</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Model Selection</label>
                  <select value={newAgent.model} onChange={e => setNewAgent({ ...newAgent, model: e.target.value })} className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Capabilities</label>
                <div className="space-y-1.5">
                  {['Web Search', 'Artifact (Create, Update, Retrieve)', 'Project Knowledge', 'Code Interpreter', 'File Attachments'].map(cap => (
                    <label key={cap} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span>{cap}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Agent Type</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="radio" name="agentType" checked={newAgent.agentType === 'system'} onChange={() => setNewAgent({ ...newAgent, agentType: 'system', sharedWithRoles: [] })} />
                    <span>System</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="radio" name="agentType" checked={newAgent.agentType === 'shared'} onChange={() => setNewAgent({ ...newAgent, agentType: 'shared' })} />
                    <span>Shared</span>
                  </label>
                </div>
              </div>
              {newAgent.agentType === 'shared' && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Share with Roles</label>
                  <div className="space-y-1.5">
                    {availableRoles.map(role => (
                      <label key={role} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={newAgent.sharedWithRoles.includes(role)}
                          onChange={e => {
                            if (e.target.checked) setNewAgent({ ...newAgent, sharedWithRoles: [...newAgent.sharedWithRoles, role] });
                            else setNewAgent({ ...newAgent, sharedWithRoles: newAgent.sharedWithRoles.filter(r => r !== role) });
                          }}
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">{editingAgentId ? 'Save Changes' : 'Create Agent'}</button>
              {editingAgentId && (
                <button className="px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90">Delete Agent</button>
              )}
              <button onClick={() => { setShowAddAgent(false); setEditingAgentId(null); setNewAgent(defaultAgent); }} className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="p-4 rounded-lg border border-border space-y-3 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{agent.name}</span>
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center" title={`${roleCounts[agent.id] || 0} user roles mapped to this agent`}>
                    <span className="text-[10px] font-bold text-primary-foreground">{roleCounts[agent.id] || 0}</span>
                  </div>
                </div>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", (agent as any).agentType === 'shared' ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground")}>{(agent as any).agentType === 'shared' ? 'Shared' : 'System'}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
              <div className="text-xs text-muted-foreground">
                <span>Created: Jan 2025</span>
                <span className="mx-2">·</span>
                <span>Shared with: All</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {agent.capabilities.map(c => (
                  <span key={c.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-[10px] text-accent-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    {c.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                <span className="font-mono">Model: {agent.model}</span>
                <span>·</span>
                <span>Prompt: v{agent.version}</span>
                <span className="ml-auto flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingAgentId(agent.id);
                      setShowAddAgent(false);
                      setNewAgent({
                        name: agent.name,
                        description: agent.description,
                        prompt: '',
                        model: agent.model,
                        capabilities: agent.capabilities.map(c => c.name),
                        agentType: (agent as any).agentType === 'shared' ? 'shared' : 'system',
                        sharedWithRoles: [],
                      });
                    }}
                    className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  if (tab === 'prompts') {
    const prompts = [
      { name: 'General Agent Prompt', description: 'Default prompt for the General Agent', version: 'v1.0', updatedAt: 'Mar 1, 2025', template: 'You are a General Agent. Help users with proposals, SOWs, executive summaries, and company comparison tables. Always output structured markdown artifacts when generating documents.', linkedAgents: ['General Agent'] },
      { name: 'HR Agent Prompt', description: 'Prompt template for HR-related queries', version: 'v1.0', updatedAt: 'Feb 20, 2025', template: 'You are an HR Agent. Answer questions about company policies, benefits, leave management, and internal HR procedures. Always reference the official HR knowledge base.', linkedAgents: ['HR Agent'] },
      { name: 'IT Support Prompt', description: 'Prompt for IT troubleshooting and setup', version: 'v1.0', updatedAt: 'Feb 15, 2025', template: 'You are an IT Support Agent. Help users troubleshoot technical issues, set up software, and resolve common IT problems. Reference the IT knowledge base for standard procedures.', linkedAgents: ['IT Support Agent'] },
    ];

    const filteredPrompts = promptSearch
      ? prompts.filter(p => p.name.toLowerCase().includes(promptSearch.toLowerCase()) || p.description.toLowerCase().includes(promptSearch.toLowerCase()))
      : prompts;

    return (
      <div className="w-full p-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Prompt Manager</h2>
            <p className="text-sm text-muted-foreground mt-1">Create, edit, and manage your prompt templates with versioning.</p>
          </div>
          {!showNewPrompt && (
            <button
              onClick={() => setShowNewPrompt(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Prompt
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-border rounded-lg flex-1">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={promptSearch}
            onChange={e => setPromptSearch(e.target.value)}
            placeholder="Search prompts..."
            className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {showNewPrompt && (
          <div className="p-5 rounded-lg border border-border bg-secondary/20 space-y-4 max-w-2xl animate-scale-in">
            <h3 className="text-sm font-semibold text-foreground">Create New Prompt</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Prompt Name</label>
                <input placeholder="e.g. Research Prompt" className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Short Description</label>
                <input placeholder="What is this prompt for?" className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Prompt Template Text</label>
                <textarea rows={5} placeholder="Enter your prompt template..." className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">Create Prompt</button>
              <button onClick={() => setShowNewPrompt(false)} className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {filteredPrompts.map((p, i) => (
            <div key={i} className="rounded-lg border border-border overflow-hidden">
              <div
                onClick={() => setExpandedPromptIdx(expandedPromptIdx === i ? null : i)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-sm cursor-pointer"
              >
                {expandedPromptIdx === i ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.description}</div>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{p.version}</span>
                <span className="text-xs text-muted-foreground">{p.updatedAt}</span>
                <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                  <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Copy"><Copy className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              {expandedPromptIdx === i && (
                <div className="px-4 pb-4 pt-1 border-t border-border bg-secondary/10 space-y-3 animate-fade-in">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Prompt Template</span>
                    <div className="mt-1.5 p-3 rounded-md bg-background border border-border text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">{p.template}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Linked Agents ({p.linkedAgents.length})</span>
                    <div className="flex gap-1.5">
                      {p.linkedAgents.map(a => (
                        <span key={a} className="px-2 py-0.5 rounded-full bg-accent text-[10px] text-accent-foreground">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === 'groups') {
    const groups = [
      {
        name: 'Admin',
        agents: ['General Agent', 'HR Agent', 'Social Media Agent', 'IT Support Agent'],
        canShare: true,
        rights: ['Can create agents', 'Can edit agents', 'Can manage prompts', 'Can manage group permissions'],
      },
      {
        name: 'Standard Users',
        agents: ['General Agent', 'HR Agent', 'IT Support Agent'],
        canShare: true,
        rights: [],
      },
      {
        name: 'Marketing Team',
        agents: ['General Agent', 'Social Media Agent'],
        canShare: false,
        rights: [],
      },
    ];

    return (
      <div className="w-full p-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Group Permissions</h2>
            <p className="text-sm text-muted-foreground mt-1">Configure access rights for each group.</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add Group
          </button>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="bg-secondary border-b border-border">
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-48">Group Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-32">Users Mapped</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Access Rights</th>
                <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-36">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g, i) => {
                const usersMapped: Record<string, { count: number; users: string[] }> = {
                  'Admin': { count: 2, users: ['Alex Thompson', 'Michael Brown'] },
                  'Standard Users': { count: 8, users: ['John Smith', 'Sarah Lee', 'Tom Harris', 'Emma Davis', 'Chris Johnson', 'Lisa Park', 'David Kim', 'James Wilson'] },
                  'Marketing Team': { count: 3, users: ['Amy Chen', 'Mark Foster', 'Rachel Green'] },
                };
                const mapped = usersMapped[g.name] || { count: 0, users: [] };
                return (
                <tr key={i} className="border-b border-border last:border-0 align-top">
                  <td className="px-4 py-3 font-medium text-foreground">{g.name}</td>
                  <td className="px-4 py-3">
                    <UsersMappedCell count={mapped.count} users={mapped.users} />
                  </td>
                  <td className="px-4 py-3 space-y-2.5">
                    <div>
                      <span className="text-xs font-semibold text-foreground">Assigned Agents:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {g.agents.map(a => (
                          <span key={a} className="px-2 py-0.5 rounded-full bg-secondary text-xs text-secondary-foreground">{a}</span>
                        ))}
                      </div>
                    </div>
                    {g.canShare && (
                      <div>
                        <span className="text-xs font-semibold text-foreground">Project Sharing:</span>
                        <div className="mt-1">
                          <span className="px-2 py-0.5 rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">Can Share</span>
                        </div>
                      </div>
                    )}
                    {g.rights.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-foreground">Management Rights:</span>
                        <ul className="mt-1 space-y-0.5">
                          {g.rights.map(r => (
                            <li key={r} className="text-xs text-muted-foreground">{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!g.canShare && g.rights.length === 0 && (
                      <div className="text-xs text-muted-foreground italic">No project sharing · No management rights</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Map Users"><Users className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
