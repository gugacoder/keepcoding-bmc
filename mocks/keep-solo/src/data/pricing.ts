export interface Plan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  popular: boolean
  features: string[]
  cta: string
  agentCount: string
  workflowCount: string
}

export const keepsoloPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    agentCount: '1',
    workflowCount: '2',
    features: [
      '1 agente de IA',
      '2 workflows ativos',
      'Integração WhatsApp básica',
      'Monitor simples',
      'Suporte por comunidade',
      '1.000 mensagens/mês',
    ],
    cta: 'Começar Grátis',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 97,
    yearlyPrice: 79,
    popular: true,
    agentCount: '3',
    workflowCount: '10',
    features: [
      '3 agentes de IA',
      '10 workflows ativos',
      'WhatsApp + Email + Instagram',
      'Monitor em tempo real',
      'Suporte por email',
      '20.000 mensagens/mês',
      'Relatórios de funil',
    ],
    cta: 'Começar Agora',
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 247,
    yearlyPrice: 197,
    popular: false,
    agentCount: '10',
    workflowCount: 'Ilimitados',
    features: [
      '10 agentes de IA',
      'Workflows ilimitados',
      'Todas as integrações',
      'Monitor avançado + alertas',
      'Suporte prioritário',
      '100.000 mensagens/mês',
      'Relatórios avançados',
      'API de acesso',
    ],
    cta: 'Começar Agora',
  },
]
