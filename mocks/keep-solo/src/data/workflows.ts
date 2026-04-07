import type { Workflow } from './types';

export const workflows: Workflow[] = [
  {
    id: 'wf-s-001',
    name: 'Resposta a Novos Leads via WhatsApp',
    description: 'Quando um lead novo chega pelo Instagram ou site, envia mensagem personalizada de boas-vindas pelo WhatsApp em até 5 minutos.',
    status: 'agente_ativo',
    agentId: 'agent-s-001',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-04-06T15:30:00Z',
  },
  {
    id: 'wf-s-002',
    name: 'Agendamento de Consultas pelo Google Calendar',
    description: 'Recebe pedidos de agendamento via DM ou formulário, confere disponibilidade e envia link de confirmação automático.',
    status: 'implantado',
    agentId: 'agent-s-001',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-04-01T11:00:00Z',
  },
  {
    id: 'wf-s-003',
    name: 'Publicação Semanal no Instagram',
    description: 'Toda segunda-feira cria um rascunho de post com base nos conteúdos aprovados da semana e agenda para o melhor horário de engajamento.',
    status: 'mapeado',
    agentId: null,
    createdAt: '2026-04-07T10:00:00Z',
    updatedAt: '2026-04-07T10:00:00Z',
  },
];
