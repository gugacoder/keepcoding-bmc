export interface Plan {
  id: string
  name: string
  monthlyPrice: number | null
  yearlyPrice: number | null
  popular: boolean
  features: string[]
  cta: string
  ctaAction: 'register' | 'contact'
  agentCount: string
  workflowCount: string
}

export const keepbizPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 297,
    yearlyPrice: 247,
    popular: false,
    agentCount: '3',
    workflowCount: '5',
    features: [
      '3 agentes de IA',
      '5 workflows ativos',
      'Integrações básicas (WhatsApp, Email)',
      'Monitor em tempo real',
      'Suporte por email',
      '10.000 mensagens/mês',
    ],
    cta: 'Começar Grátis',
    ctaAction: 'register',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 897,
    yearlyPrice: 747,
    popular: true,
    agentCount: '10',
    workflowCount: '20',
    features: [
      '10 agentes de IA',
      '20 workflows ativos',
      'Integrações avançadas (CRM, ERP)',
      'Monitor em tempo real + alertas',
      'Suporte prioritário',
      '100.000 mensagens/mês',
      'Relatórios de performance',
      'Multi-usuário (até 5 seats)',
    ],
    cta: 'Começar Agora',
    ctaAction: 'register',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    popular: false,
    agentCount: 'Ilimitados',
    workflowCount: 'Ilimitados',
    features: [
      'Agentes ilimitados',
      'Workflows ilimitados',
      'Integrações customizadas',
      'SLA 99.9% garantido',
      'Suporte dedicado 24/7',
      'Mensagens ilimitadas',
      'Relatórios avançados + BI',
      'SSO / SAML',
      'Onboarding personalizado',
    ],
    cta: 'Falar com Vendas',
    ctaAction: 'contact',
  },
]

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
    ctaAction: 'register',
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
    ctaAction: 'register',
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
    ctaAction: 'register',
  },
]
