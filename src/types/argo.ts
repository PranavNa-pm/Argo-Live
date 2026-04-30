export interface Tool {
  id: string;
  name: string;
  description: string;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  tools: string[];
}

export interface Agent {
  id: string;
  name: string;
  version: string;
  description: string;
  model: string;
  capabilities: Capability[];
}

export interface SkillReference {
  title: string;
  url?: string;
}

export interface SkillAsset {
  name: string;
  type?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  scope: 'org' | 'group' | 'personal';
  /** Group label (only relevant when scope === 'group'). */
  group?: string;
  instructions?: string;
  tools?: Tool[];
  references?: SkillReference[];
  assets?: SkillAsset[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'message' | 'clarification';
  suggestions?: string[];
  agentId?: string;
  agentName?: string;
  timestamp: Date;
  artifactId?: string;
  trace?: ExecutionTrace;
}

export interface TraceTool {
  name: string;
  status: 'running' | 'success' | 'failed';
  error?: string;
}

export interface ExecutionTrace {
  agentName: string;
  agentVersion: string;
  capability: string;
  toolsUsed: string[];
  tools?: TraceTool[];
  documentsRetrieved: string[];
  model: string;
  tokenUsage: { input: number; output: number };
  latencyMs: number;
  costEstimate: string;
}

export interface ArtifactVersion {
  version: number;
  content: string;
  timestamp: Date;
  fileSize: string;
}

export interface Artifact {
  id: string;
  name: string;
  content: string;
  spaceId: string;
  chatId: string;
  agentId: string;
  agentName: string;
  capability: string;
  artifactType: 'markdown' | 'html' | 'pptx-outline';
  toolsUsed: string[];
  timestamp: Date;
  version: number;
  versions: ArtifactVersion[];
  fileSize: string;
  trace: ExecutionTrace;
}

export interface Chat {
  id: string;
  name: string;
  spaceId: string;
  messages: Message[];
  createdAt: Date;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  projectContext?: string;
  visibility: 'private' | 'shared';
  isDefault?: boolean;
  owner: string;
  sharedBy?: string;
  createdAt: Date;
  shareCode?: string; // permanent unique token — never changes even if name/description changes
}

export type CenterView = 'chat' | 'config' | 'artifacts-table' | 'space-workspace' | 'new-space' | 'projects' | 'skills';
export type RightPanelView = 'empty' | 'artifact' | 'files' | 'skill';
export type AdminTab = 'agents' | 'prompts' | 'groups';
