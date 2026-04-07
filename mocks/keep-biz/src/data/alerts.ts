import type { Alert } from './types';

export const alerts: Alert[] = [
  {
    id: 'alert-001',
    title: 'Menção negativa no Reclame Aqui',
    description: 'Fernanda Oliveira registrou reclamação sobre indisponibilidade do sistema. Requer resposta em até 24h para manter score.',
    severity: 'critical',
    date: '2026-04-05T10:20:00Z',
    read: false,
  },
  {
    id: 'alert-002',
    title: 'Pico de menções no Twitter/X',
    description: 'Volume de menções subiu 320% nas últimas 6 horas. Maioria positiva relacionada ao último update de produto.',
    severity: 'info',
    date: '2026-04-06T17:00:00Z',
    read: false,
  },
  {
    id: 'alert-003',
    title: 'Score de reputação em queda',
    description: 'Reputação caiu de 87 para 82 pontos nos últimos 7 dias. Principais causas: 2 reviews negativos no Google e 1 reclamação no Reclame Aqui.',
    severity: 'warning',
    date: '2026-04-07T08:00:00Z',
    read: false,
  },
  {
    id: 'alert-004',
    title: 'Novo review 5 estrelas no Google',
    description: 'Roberto Almeida deixou avaliação 5 estrelas destacando agilidade do suporte. Boa oportunidade para agradecer e engajar.',
    severity: 'info',
    date: '2026-04-07T09:30:00Z',
    read: true,
  },
];
