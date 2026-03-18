import { useState } from 'react';
import {
  Plus, MessageSquare, Search, SquarePen,
  Settings, Bot, BookOpen, Users,
  PanelLeftClose, PanelLeft, ChevronDown, ChevronRight, MoreHorizontal,
  FolderOpen, Archive, LogOut, Globe, Lock
} from 'lucide-react';
import { useArgo } from '@/context/ArgoContext';
import { cn } from '@/lib/utils';
import argoBrainIcon from '@/assets/argo-brain-icon.png';



const MOCK_USER = { firstName: 'Pranav', lastName: 'Nagrani', email: 'pranav@cybage.com' };

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}${'*'.repeat(4)}@${domain}`;
}

function UserProfileSection({ onOpenConfig }: { onOpenConfig: (tab: 'agents' | 'prompts' | 'groups') => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfigSub, setShowConfigSub] = useState(false);
  const initials = `${MOCK_USER.firstName[0]}${MOCK_USER.lastName[0]}`;

  return (
    <div className="px-2 py-2 relative">
      <button
        onClick={() => { setShowMenu(!showMenu); setShowConfigSub(false); }}
        className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-accent/60 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-primary-foreground">{initials}</span>
        </div>
        <span className="text-sm font-medium text-foreground truncate">{MOCK_USER.firstName} {MOCK_USER.lastName}</span>
      </button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setShowMenu(false); setShowConfigSub(false); }} />
          <div className="absolute bottom-full left-2 right-2 mb-1 bg-popover border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border">
              <div className="text-sm font-medium text-foreground">{MOCK_USER.firstName} {MOCK_USER.lastName}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{maskEmail(MOCK_USER.email)}</div>
            </div>
            <button
              disabled
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed opacity-50"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <div>
              <button
                onClick={() => setShowConfigSub(!showConfigSub)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="flex-1 text-left">Configurations</span>
                {showConfigSub ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              </button>
              {showConfigSub && (
                <div className="border-t border-border/50">
                  <button
                    onClick={() => { setShowMenu(false); setShowConfigSub(false); onOpenConfig('agents'); }}
                    className="w-full flex items-center gap-2 px-3 pl-9 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    Agent Configuration
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); setShowConfigSub(false); onOpenConfig('prompts'); }}
                    className="w-full flex items-center gap-2 px-3 pl-9 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Prompt Management
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); setShowConfigSub(false); onOpenConfig('groups'); }}
                    className="w-full flex items-center gap-2 px-3 pl-9 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Group Permissions
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export function LeftPanel() {
  const {
    spaces, activeSpaceId, chats, activeChatId, setActiveChatId,
    setCenterView, setAdminTab,
    createChat, openSpaceWorkspace, renameChat,
    setActiveArtifactId, setRightPanelView, centerView,
    sidebarCollapsed, setSidebarCollapsed,
  } = useArgo();

  const [searchQuery, setSearchQuery] = useState('');
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [chatMenuId, setChatMenuId] = useState<string | null>(null);

  const generalChatSpace = spaces.find(s => s.isDefault);
  const projectSpaces = spaces.filter(s => !s.isDefault);

  const generalChatChats = generalChatSpace ? chats.filter(c => c.spaceId === generalChatSpace.id) : [];

  // Recent projects: last 5 by createdAt
  const recentProjects = [...projectSpaces]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Search across project names and chat titles
  const searchResults = searchQuery ? (() => {
    const q = searchQuery.toLowerCase();
    const matchedProjects = projectSpaces.filter(s => s.name.toLowerCase().includes(q));
    const matchedChats = chats.filter(c => c.name.toLowerCase().includes(q));
    return { projects: matchedProjects, chats: matchedChats };
  })() : null;

  const handleNewChat = () => {
    createChat('New Chat', generalChatSpace?.id || 'space-my');
  };

  const handleSearchClick = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  };

  const handleOpenConfig = (tab: 'agents' | 'prompts' | 'groups') => {
    setCenterView('config');
    setAdminTab(tab);
    setActiveArtifactId(null);
    setRightPanelView('empty');
  };

  // Collapsed sidebar
  if (sidebarCollapsed) {
    return (
      <div className="h-screen flex flex-col items-center bg-sidebar panel-border-right py-3 gap-1 w-full">
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors mb-1"
          title="Expand sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <button onClick={handleNewChat} className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="New Chat">
          <SquarePen className="w-4 h-4" />
        </button>
        <button onClick={handleSearchClick} className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Search">
          <Search className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer" title={`${MOCK_USER.firstName} ${MOCK_USER.lastName}`}>
          <span className="text-[10px] font-semibold text-primary-foreground">{MOCK_USER.firstName[0]}{MOCK_USER.lastName[0]}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-sidebar overflow-hidden panel-border-right">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={argoBrainIcon} alt="ARGO" className="w-6 h-6" />
          <span className="text-sm font-bold text-foreground tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>ARGO</span>
        </div>
        <button onClick={() => setSidebarCollapsed(true)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Collapse sidebar">
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* ═══ Zone 1: Actions ═══ */}
      <div className="px-3 pt-3 pb-2 space-y-1.5">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </button>
      </div>

      {/* Zone divider */}
      <div className="mx-3 border-t border-border" />

      {/* ═══ Zone 2: Navigation ═══ */}
      <div className="flex-1 overflow-y-auto argo-scrollbar">
        <div className="px-2 pt-2.5 pb-1 space-y-0.5">
          {/* Search */}
          <div className="px-1 pb-1.5">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-background border border-border rounded-md">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects & chats..."
                className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Search results */}
          {searchQuery && searchResults ? (
            <div className="px-1 space-y-0.5">
              {searchResults.projects.length === 0 && searchResults.chats.length === 0 ? (
                <div className="text-[11px] text-muted-foreground py-2 px-3">No results found.</div>
              ) : (
                <>
                  {searchResults.projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => openSpaceWorkspace(project.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left",
                        activeSpaceId === project.id && centerView === 'space-workspace'
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      <span className="truncate flex-1">{project.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">Project</span>
                    </button>
                  ))}
                  {searchResults.chats.map(c => {
                    const project = spaces.find(s => s.id === c.spaceId);
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveChatId(c.id);
                          setCenterView('chat');
                          setActiveArtifactId(null);
                          setRightPanelView('empty');
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left",
                          activeChatId === c.id && centerView === 'chat'
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                        )}
                      >
                        <span className="truncate flex-1">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{project?.name}</span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            <>
              {/* Projects */}
              <button
                onClick={() => {
                  setCenterView('projects');
                  setActiveArtifactId(null);
                  setRightPanelView('empty');
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  centerView === 'projects'
                    ? "bg-accent text-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-accent/60"
                )}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Projects</span>
              </button>

              {/* Artifacts */}
              <button
                onClick={() => {
                  setCenterView('artifacts-table');
                  setActiveArtifactId(null);
                  setRightPanelView('empty');
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  centerView === 'artifacts-table'
                    ? "bg-accent text-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-accent/60"
                )}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Artifacts</span>
              </button>

              {/* Zone divider */}
              <div className="mx-1 my-1.5 border-t border-border" />

              {/* ── Recent Projects ── */}
              <div className="mb-1">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-foreground/70 uppercase tracking-wider">
                  Recent Projects
                </div>
                <div className="space-y-0.5">
                  {recentProjects.length === 0 ? (
                    <div className="text-[11px] text-muted-foreground py-2 px-3">No projects yet.</div>
                  ) : (
                    recentProjects.map(project => {
                      const projectChats = chats.filter(c => c.spaceId === project.id && c.messages.length > 0);
                      const isActiveProject = activeSpaceId === project.id && !spaces.find(s => s.id === activeSpaceId)?.isDefault;
                      return (
                        <div key={project.id}>
                          <div className="flex items-center group">
                            <button
                              onClick={() => openSpaceWorkspace(project.id)}
                              className={cn(
                                "flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left",
                                isActiveProject
                                  ? "bg-accent text-foreground font-medium"
                                  : "text-sidebar-foreground hover:bg-accent/60"
                              )}
                            >
                              {isActiveProject ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                              <span className="truncate flex-1 font-medium">{project.name}</span>
                              {project.visibility === 'shared' ? <Globe className="w-3 h-3 text-muted-foreground shrink-0" /> : <Lock className="w-3 h-3 text-muted-foreground shrink-0" />}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                createChat('New Chat', project.id);
                              }}
                              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0"
                              title="New chat in this project"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          {/* Accordion: show chats when this project is active */}
                          {isActiveProject && projectChats.length > 0 && (
                            <div className="ml-4 space-y-0.5 mt-0.5 border-l border-border/60 pl-2">
                              {projectChats.slice(0, 5).map(c => (
                                <div key={c.id} className="relative group/chat flex items-center">
                                  {renamingChatId === c.id ? (
                                    <div className="w-full px-1 py-0.5">
                                      <input
                                        value={renameValue}
                                        onChange={e => setRenameValue(e.target.value)}
                                        onKeyDown={e => {
                                          if (e.key === 'Enter') { renameChat(c.id, renameValue.trim() || c.name); setRenamingChatId(null); }
                                          if (e.key === 'Escape') setRenamingChatId(null);
                                        }}
                                        onBlur={() => { renameChat(c.id, renameValue.trim() || c.name); setRenamingChatId(null); }}
                                        className="w-full text-xs bg-background border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                        autoFocus
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          setActiveChatId(c.id);
                                          setCenterView('chat');
                                          setActiveArtifactId(null);
                                          setRightPanelView('empty');
                                        }}
                                        className={cn(
                                          "flex-1 flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors text-left",
                                          activeChatId === c.id && centerView === 'chat'
                                            ? "bg-accent text-foreground"
                                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                                        )}
                                      >
                                        <span className="truncate">{c.name}</span>
                                      </button>
                                      <div className="relative">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setChatMenuId(chatMenuId === c.id ? null : c.id);
                                          }}
                                          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground opacity-0 group-hover/chat:opacity-100 transition-all"
                                        >
                                          <MoreHorizontal className="w-3.5 h-3.5" />
                                        </button>
                                        {chatMenuId === c.id && (
                                          <>
                                            <div className="fixed inset-0 z-10" onClick={() => setChatMenuId(null)} />
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                                              <button
                                                onClick={() => {
                                                  setRenameValue(c.name);
                                                  setRenamingChatId(c.id);
                                                  setChatMenuId(null);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                                              >
                                                Rename
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                              {projectChats.length > 5 && (
                                <button
                                  onClick={() => openSpaceWorkspace(project.id)}
                                  className="w-full px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors text-left"
                                >
                                  View More ({projectChats.length - 5})
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Zone divider */}
              {generalChatSpace && <div className="mx-1 my-1.5 border-t border-border" />}

              {/* ── General Chat Section ── */}
              {generalChatSpace && (
                <div className="mb-1">
                  <div className="flex items-center group">
                    <button
                      onClick={() => openSpaceWorkspace(generalChatSpace.id)}
                      className={cn(
                        "flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors text-left",
                        activeSpaceId === generalChatSpace.id && centerView === 'space-workspace'
                          ? "bg-accent text-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-accent/60"
                      )}
                    >
                      <span className="truncate flex-1 font-medium">General Chat</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground shrink-0">Default</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        createChat('New Chat', generalChatSpace.id);
                      }}
                      className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="New chat"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="ml-4 space-y-0.5 mt-0.5 border-l border-border/60 pl-2">
                    {generalChatChats.filter(c => c.messages.length > 0).length === 0 && (
                      <div className="text-[11px] text-muted-foreground py-1 px-2">No chats</div>
                    )}
                    {generalChatChats.filter(c => c.messages.length > 0).slice(0, 5).map(c => (
                      <div key={c.id} className="relative group/chat flex items-center">
                        {renamingChatId === c.id ? (
                          <div className="w-full px-1 py-0.5">
                            <input
                              value={renameValue}
                              onChange={e => setRenameValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') { renameChat(c.id, renameValue.trim() || c.name); setRenamingChatId(null); }
                                if (e.key === 'Escape') setRenamingChatId(null);
                              }}
                              onBlur={() => { renameChat(c.id, renameValue.trim() || c.name); setRenamingChatId(null); }}
                              className="w-full text-xs bg-background border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setActiveChatId(c.id);
                                setCenterView('chat');
                                setActiveArtifactId(null);
                                setRightPanelView('empty');
                              }}
                              className={cn(
                                "flex-1 flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors",
                                activeChatId === c.id && centerView === 'chat'
                                  ? "bg-accent text-foreground"
                                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                              )}
                            >
                              <span className="truncate">{c.name}</span>
                            </button>
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChatMenuId(chatMenuId === c.id ? null : c.id);
                                }}
                                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground opacity-0 group-hover/chat:opacity-100 transition-all"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                              {chatMenuId === c.id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setChatMenuId(null)} />
                                  <div className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                                    <button
                                      onClick={() => {
                                        setRenameValue(c.name);
                                        setRenamingChatId(c.id);
                                        setChatMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                                    >
                                      Rename
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {generalChatChats.filter(c => c.messages.length > 0).length > 5 && (
                      <button
                        onClick={() => openSpaceWorkspace(generalChatSpace.id)}
                        className="w-full px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors text-left"
                      >
                        View More ({generalChatChats.length - 5})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Zone divider */}
      <div className="mx-3 border-t border-border" />

      {/* ═══ User Profile ═══ */}
      <UserProfileSection onOpenConfig={handleOpenConfig} />
    </div>
  );
}
