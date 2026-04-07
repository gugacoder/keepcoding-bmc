import type { Agent } from './types';

export const agents: Agent[] = [
  {
    id: 'agent-s-001',
    name: 'Meu Agente',
    role: 'Assistente Pessoal de Negócios',
    avatar: '/assets/avatar-generic.png',
    status: 'Working',
    heartbeat: true,
    lastActive: '2026-04-07T11:55:00Z',
    workflowId: 'wf-s-001',
    trainingProgress: 78,
    activities: [
      {
        id: 'act-s-001-1',
        description: 'Enviou mensagem de boas-vindas para @patricia_nutricionista no Instagram',
        timestamp: '2026-04-07T11:50:00Z',
        type: 'action',
      },
      {
        id: 'act-s-001-2',
        description: 'Confirmou agendamento de consulta para 09/04 às 14h — enviado por e-mail e WhatsApp',
        timestamp: '2026-04-07T11:53:00Z',
        type: 'completed',
      },
      {
        id: 'act-s-001-3',
        description: 'Rascunho de post criado: "3 dicas para emagrecer sem sofrimento"',
        timestamp: '2026-04-07T11:55:00Z',
        type: 'action',
      },
    ],
    memory: [
      {
        id: 'mem-s-001-1',
        category: 'operações',
        content: 'Consultas acontecem às terças e quintas, das 09h às 17h',
        addedAt: '2026-02-22T09:00:00Z',
      },
      {
        id: 'mem-s-001-4',
        category: 'operações',
        content: 'Valor da consulta: R$ 180 (presencial) | R$ 150 (online)',
        addedAt: '2026-03-01T08:00:00Z',
      },
      {
        id: 'mem-s-001-5',
        category: 'operações',
        content: 'Confirmação de consulta enviada 24h antes por WhatsApp e e-mail',
        addedAt: '2026-03-05T09:00:00Z',
      },
      {
        id: 'mem-s-001-2',
        category: 'preferências',
        content: 'Tom de comunicação: amigável, motivador, sem termos técnicos excessivos',
        addedAt: '2026-02-22T09:05:00Z',
      },
      {
        id: 'mem-s-001-6',
        category: 'preferências',
        content: 'Usar o primeiro nome do cliente em todas as mensagens',
        addedAt: '2026-02-28T10:00:00Z',
      },
      {
        id: 'mem-s-001-7',
        category: 'preferências',
        content: 'Posts publicados às 18h às sextas — horário de maior engajamento',
        addedAt: '2026-03-08T11:00:00Z',
      },
      {
        id: 'mem-s-001-3',
        category: 'regras',
        content: 'Não agendar mais de 6 consultas por dia para manter qualidade',
        addedAt: '2026-02-25T10:00:00Z',
      },
      {
        id: 'mem-s-001-8',
        category: 'regras',
        content: 'Cancelamentos com menos de 24h de antecedência geram cobrança de 50%',
        addedAt: '2026-03-02T09:00:00Z',
      },
      {
        id: 'mem-s-001-9',
        category: 'regras',
        content: 'Não divulgar preços antes de explicar a proposta de valor',
        addedAt: '2026-03-10T10:00:00Z',
      },
    ],
    hints: [
      {
        id: 'hint-s-001-1',
        suggestion: 'Notei que você responde DMs manualmente toda manhã entre 08h e 09h — quer que eu assuma esse processo?',
        detectedAt: '2026-04-06T09:05:00Z',
        dismissed: false,
      },
      {
        id: 'hint-s-001-2',
        suggestion: 'Você tem 3 leads no estágio "contato" há mais de 7 dias sem follow-up — posso enviar uma mensagem de acompanhamento?',
        detectedAt: '2026-04-07T08:00:00Z',
        dismissed: false,
      },
      {
        id: 'hint-s-001-3',
        suggestion: 'Percebi que você posta toda sexta-feira por volta das 18h — quer que eu agende e publique automaticamente nesse horário?',
        detectedAt: '2026-04-07T10:30:00Z',
        dismissed: false,
      },
      {
        id: 'hint-s-001-4',
        suggestion: 'Toda semana você envia planilha de agendamentos para si mesmo por e-mail — posso gerar esse relatório e enviar automaticamente às segundas?',
        detectedAt: '2026-04-07T11:00:00Z',
        dismissed: false,
      },
    ],
  },
];
