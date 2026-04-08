import type { Profile } from './types';

export const soloProfile: Profile = {
  id: 'PRF-SOLO',
  identity: {
    businessName: 'Cia Cuidadores',
    url: 'https://ciacuidadores.com.br',
    socialLinks: [
      'https://instagram.com/ciacuidadores',
      'https://facebook.com/ciacuidadores',
      'https://linkedin.com/company/cia-cuidadores',
    ],
  },
  niche: {
    segment: 'saude',
    targetAudience: 'Famílias que precisam de cuidadores qualificados para idosos, pessoas com deficiência ou em recuperação',
    competitors: ['CuidarBem', 'Homecare Brasil', 'Rede Cuidar'],
  },
  positioning: {
    differentials: [
      'Cuidadores certificados com verificação de antecedentes',
      'Acompanhamento 24h via aplicativo para a família',
      'Atendimento humanizado com foco no vínculo afetivo',
      'Planos flexíveis: por hora, diária ou mensal',
    ],
    statement: 'Conectamos famílias a cuidadores de confiança, proporcionando tranquilidade e qualidade de vida para quem mais precisa.',
    agentSuggestion: 'Explorar stories e reels com depoimentos de famílias atendidas e dicas de bem-estar para idosos. Forte potencial no Instagram e Facebook.',
  },
  tone: {
    primary: 'amigável',
    examples: [
      'Cuidar é um ato de amor. Na Cia Cuidadores, treinamos cada profissional para ser mais que um cuidador — ser um parceiro da família.',
      'Sua mãe merece o melhor cuidado, mesmo quando você não pode estar presente. Conte com a gente.',
      'Encontre o cuidador ideal para a sua família em minutos. Simples, seguro e com o carinho que faz toda a diferença.',
    ],
  },
  platforms: ['Instagram', 'Facebook', 'LinkedIn', 'WhatsApp'],
  status: 'ativo',
  completeness: 100,
  createdAt: '2024-03-01T09:00:00Z',
  updatedAt: '2024-04-01T11:00:00Z',
};

export const profileConfigured: boolean = true;
