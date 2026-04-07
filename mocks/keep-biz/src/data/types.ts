// KeepBiz — shared TypeScript types for mock data

export type WorkflowStatus =
  | 'mapeado'
  | 'app_em_criacao'
  | 'app_pronto'
  | 'implantado'
  | 'agente_treinando'
  | 'agente_pronto'
  | 'agente_ativo';

export type Department =
  | 'Atendimento'
  | 'Financeiro'
  | 'Marketing'
  | 'Operações'
  | 'RH';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  department: Department;
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
  department: Department;
  status: AgentStatus;
  heartbeat: boolean;
  lastActive: string;
  workflowId: string | null;
  trainingProgress: number;
  activities: AgentActivity[];
  memory: MemoryItem[];
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

export type ConnectorStatus = 'connected' | 'disconnected';
export type ConnectorCategory =
  | 'Produtividade'
  | 'Comunicação'
  | 'Finanças'
  | 'CRM'
  | 'ERP'
  | 'Marketing';

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
  | 'aprovado'
  | 'agendado'
  | 'publicado';

export type ContentType = 'post' | 'short' | 'campanha' | 'criativo';
export type ContentPlatform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'Twitter' | 'Multi';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  platform: ContentPlatform;
  status: ContentStatus;
  author: string;
  briefing: string;
  targetDate: string;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  status: ContentStatus;
  timestamp: string;
  by: string;
}

export type MentionSentiment = 'positivo' | 'neutro' | 'negativo';
export type MentionSource = 'Twitter/X' | 'Google Reviews' | 'Instagram' | 'LinkedIn' | 'Reclame Aqui';

export interface Mention {
  id: string;
  source: MentionSource;
  author: string;
  content: string;
  sentiment: MentionSentiment;
  date: string;
  url: string | null;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  date: string;
  read: boolean;
}

export type TeamRole = 'Admin' | 'Operador' | 'Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  department: Department;
  avatarInitials: string;
  joinedAt: string;
  active: boolean;
}

export type AuditAction =
  | 'workflow_created'
  | 'workflow_deployed'
  | 'agent_activated'
  | 'agent_paused'
  | 'content_approved'
  | 'content_published'
  | 'connector_added'
  | 'connector_removed'
  | 'member_invited'
  | 'settings_updated';

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  triggeredBy: string;
  entity: string;
  entityType: string;
  timestamp: string;
  details: string;
}
