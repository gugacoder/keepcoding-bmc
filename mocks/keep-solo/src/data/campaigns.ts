import type { AiCampaign } from './types';

export const campaigns: AiCampaign[] = [
  {
    id: 'camp-solo-001',
    title: 'Semana do Cuidador: Valorizando Quem Cuida',
    description:
      'Campanha de 3 posts para a Semana Nacional do Cuidador, posicionando a Cia Cuidadores como referência em cuidado humanizado. Conteúdo que valoriza cuidadores e educa famílias sobre como escolher o profissional certo.',
    objective: 'engajamento',
    source: 'ai',
    status: 'proposta',
    createdAt: '2026-04-07T10:30:00Z',
    posts: [
      {
        title: 'Cuidar de quem cuida: a missão que nos move',
        briefing:
          'Post emocional abrindo a semana do cuidador. Texto em primeira pessoa, voz da Cia Cuidadores. Destacar a importância do cuidador profissional na vida de idosos e famílias. Imagem sugestiva: mãos de cuidador e idoso. CTA: "Compartilhe se você tem alguém que cuida de você com carinho." #SemanadoCuidador #CuidadoresHumanizados #CiaCuidadores',
        channel: 'Instagram',
        targetDate: '2026-04-14',
      },
      {
        title: '5 perguntas que você deve fazer antes de contratar um cuidador',
        briefing:
          'Carrossel educativo com checklist prático para famílias. Perguntas: formação e certificação, experiência com a condição específica, referências verificáveis, disponibilidade de horário, postura e empatia. Último slide: CTA para falar com a Cia Cuidadores. #GuiadoCuidador #SaúdeDoIdoso #FamíliasUnidas',
        channel: 'Instagram',
        targetDate: '2026-04-16',
      },
      {
        title: 'Depoimento: "Minha mãe voltou a sorrir depois que a cuidadora chegou"',
        briefing:
          'Short/reel com depoimento fictício mas realista de familiar satisfeito. Formato: texto na tela com música suave de fundo. Foco na transformação emocional — não apenas no serviço. Encerrar com logo da Cia Cuidadores e telefone de contato. #Depoimento #CuidadoProfissional #TikTokSaúde',
        channel: 'TikTok',
        targetDate: '2026-04-18',
      },
    ],
  },
];
