// KeepSolo — shared TypeScript types for mock data

export type WorkflowStatus =
  | 'mapeado'
  | 'app_em_criacao'
  | 'app_pronto'
  | 'implantado'
  | 'agente_treinando'
  | 'agente_pronto'
  | 'agente_ativo';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  agentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AgentStatus = 'Idle' | 'Working' | 'Waiting on data';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  heartbeat: boolean;
  lastActive: string;
  workflowId: string | null;
  trainingProgress: number;
  activities: AgentActivity[];
  memory: MemoryItem[];
  hints: AgentHint[];
  avatar?: string;
}

export interface AgentActivity {
  id: string;
  description: string;
  timestamp: string;
  type: 'action' | 'decision' | 'alert' | 'completed';
}

export interface MemoryItem {
  id: string;
  category: 'operações' | 'preferências' | 'regras';
  content: string;
  addedAt: string;
}

export interface AgentHint {
  id: string;
  suggestion: string;
  detectedAt: string;
  dismissed: boolean;
}

export type ConnectorStatus = 'connected' | 'disconnected';
export type ConnectorCategory =
  | 'Produtividade'
  | 'Comunicação'
  | 'Finanças'
  | 'CRM'
  | 'Marketing'
  | 'Outros';

export interface Connector {
  id: string;
  name: string;
  icon: string;
  status: ConnectorStatus;
  category: ConnectorCategory;
  description: string;
  connectedAt: string | null;
}

export type ContentStatus =
  | 'rascunho'
  | 'em_revisao'
  | 'pronto'
  | 'aprovado'
  | 'agendado'
  | 'publicado';

export type ContentType = 'post' | 'short' | 'criativo' | 'artigo';
export type ContentChannel = 'Instagram' | 'TikTok' | 'LinkedIn' | 'YouTube' | 'Blog';
export type ContentSource = 'ai' | 'manual';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  channel: ContentChannel;
  status: ContentStatus;
  source: ContentSource;
  briefing: string;
  targetDate: string;
  createdAt: string;
  views?: number;
  clicks?: number;
  engagement?: number;
  thumbnail?: string;
  campaignId?: string;
  aiSuggestionId?: string;
}

export type LeadStatus = 'visitante' | 'lead' | 'contato' | 'proposta' | 'cliente' | 'perdido';
export type LeadOrigin =
  | 'Instagram'
  | 'LinkedIn'
  | 'Google Ads'
  | 'Indicação'
  | 'Site Orgânico'
  | 'WhatsApp'
  | 'TikTok';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  origin: LeadOrigin;
  status: LeadStatus;
  createdAt: string;
  lastContactAt: string;
  notes: string;
  value: number | null;
}

export interface FunnelStage {
  id: string;
  name: LeadStatus;
  label: string;
  count: number;
  value: number;
}

// Profile types
export type ProfileStatus = 'rascunho' | 'completo' | 'ativo' | 'inativo';

export interface ProfileIdentity {
  businessName: string;
  url: string;
  socialLinks: string[];
}

export interface ProfileNiche {
  segment: string;
  targetAudience: string;
  competitors: string[];
}

export interface ProfilePositioning {
  differentials: string[];
  statement: string;
  agentSuggestion: string;
}

export type ToneOfVoice = 'formal' | 'casual' | 'técnico' | 'inspiracional' | 'amigável';

export interface ProfileTone {
  primary: ToneOfVoice;
  examples: string[];
}

export interface Profile {
  id: string;
  identity: ProfileIdentity;
  niche: ProfileNiche;
  positioning: ProfilePositioning;
  tone: ProfileTone;
  platforms: string[];
  status: ProfileStatus;
  completeness: number;
  createdAt: string;
  updatedAt: string;
}
