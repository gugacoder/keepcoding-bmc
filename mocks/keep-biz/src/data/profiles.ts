import type { Profile } from './types';

export const profiles: Profile[] = [
  {
    id: 'PRF-001',
    identity: {
      businessName: 'Processa Sistemas',
      url: 'https://processasistemas.com.br',
      socialLinks: [
        'https://linkedin.com/company/processa-sistemas',
        'https://instagram.com/processasistemas',
        'https://twitter.com/processasistemas',
      ],
    },
    niche: {
      segment: 'Tecnologia',
      targetAudience: 'Empresas de médio porte que buscam automatizar processos operacionais e reduzir custos com TI',
      competitors: ['Totvs', 'Senior Sistemas', 'Sankhya'],
    },
    positioning: {
      differentials: [
        'Implementação rápida em até 30 dias',
        'Suporte humanizado sem fila de atendimento',
        'Integração nativa com sistemas legados',
      ],
      statement: 'Transformamos a operação da sua empresa com tecnologia acessível e suporte próximo, sem a burocracia dos grandes fornecedores.',
      agentSuggestion: 'Posicionar como alternativa ágil às grandes ERPs, enfatizando o custo-benefício e a proximidade com o cliente.',
    },
    tone: {
      primary: 'técnico',
      examples: [
        'Nossa API REST garante integração em menos de 2 horas com qualquer ERP legado.',
        'Redução de 40% no tempo de processamento de pedidos com nosso módulo de automação.',
        'Arquitetura multi-tenant com isolamento de dados por cliente e uptime de 99,9%.',
      ],
    },
    platforms: ['LinkedIn', 'Instagram', 'Twitter'],
    status: 'ativo',
    completeness: 100,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: 'PRF-002',
    identity: {
      businessName: 'Processa Academy',
      url: 'https://processaacademy.com.br',
      socialLinks: [
        'https://linkedin.com/company/processa-academy',
        'https://instagram.com/processaacademy',
      ],
    },
    niche: {
      segment: 'Educação & Tecnologia',
      targetAudience: 'Profissionais de TI e desenvolvedores que querem se especializar em automação e integração de sistemas',
      competitors: ['Alura', 'DIO', 'Rocketseat'],
    },
    positioning: {
      differentials: [
        'Conteúdo 100% prático baseado em casos reais',
        'Mentoria direta com especialistas da indústria',
      ],
      statement: 'Capacitamos profissionais de tecnologia com treinamentos práticos que geram resultados imediatos no trabalho.',
      agentSuggestion: 'Explorar diferenciais práticos e resultados mensuráveis dos alunos. Ainda há lacunas nos dados de posicionamento.',
    },
    tone: {
      primary: 'inspiracional',
      examples: [
        'Você está a um curso de distância de dominar a automação que vai transformar sua carreira.',
        'Aprenda com quem já resolveu os problemas que você vai encontrar na prática.',
      ],
    },
    platforms: ['LinkedIn', 'Instagram'],
    status: 'rascunho',
    completeness: 75,
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-03-20T09:15:00Z',
  },
];
