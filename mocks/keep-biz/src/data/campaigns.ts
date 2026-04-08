import type { AiCampaign } from './types';

export const campaigns: AiCampaign[] = [
  {
    id: 'camp-ai-001',
    title: 'Série: Transformação Digital para PMEs',
    description:
      'Série de 4 posts educativos posicionando a Processa Sistemas como referência em transformação digital para pequenas e médias empresas. Conteúdo focado em dores reais e soluções práticas com ERP.',
    objective: 'engajamento',
    profileId: 'PRF-001',
    source: 'ai',
    status: 'proposta',
    createdAt: '2026-04-07T09:00:00Z',
    posts: [
      {
        title: 'O que é transformação digital na prática para PMEs?',
        briefing:
          'Post educativo desmistificando transformação digital. Mostrar que não é sobre tecnologia cara, mas sobre processos eficientes. Usar linguagem acessível, exemplos do dia a dia de uma PME. CTA: "Comente o maior desafio da sua empresa hoje." #TransformaçãoDigital #PME #ERP',
        platform: 'LinkedIn',
        targetDate: '2026-04-14',
      },
      {
        title: '5 sinais de que sua empresa precisa de um ERP agora',
        briefing:
          'Carrossel com 5 dores clássicas: planilhas descoordenadas, falta de visibilidade financeira, retrabalho entre setores, dificuldade de escalar, relatórios lentos. Cada slide = 1 dor + solução breve. #ERP #GestãoEmpresarial #Produtividade',
        platform: 'Instagram',
        targetDate: '2026-04-17',
      },
      {
        title: 'Caso real: como a [cliente PME] reduziu 40% do retrabalho com ERP',
        briefing:
          'Storytelling baseado em caso de sucesso (fictício para mock). Estrutura: situação antes → desafio → solução com Processa → resultado mensurável. Tom inspiracional e confiante. #CasoDeSuccesso #ERP #Processa',
        platform: 'LinkedIn',
        targetDate: '2026-04-21',
      },
      {
        title: 'Transformação digital em 3 meses: é possível? (Mini série)',
        briefing:
          'Short mostrando linha do tempo rápida de implantação de ERP em PME. Formato reel/vídeo curto. Mostrar etapas: diagnóstico → configuração → treinamento → go-live. Música dinâmica. CTA: "Fale com a gente e veja como." #ERP #DigitalTransformation #PME',
        platform: 'TikTok',
        targetDate: '2026-04-24',
      },
    ],
  },
];
