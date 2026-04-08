# S-032 — Mock Data de Sugestões de IA

**Discoveries:** D-048
**Passada:** 1 (Dados)
**Prioridade:** 10
**Depende de:** S-031

---

## Objetivo

Criar dados mock de conteúdo gerado pela IA em ambos os apps. Os itens devem ter `source: 'ai'`, `status: 'rascunho'`, e conteúdo realista alinhado ao perfil/nicho de cada negócio. Esses dados são o pré-requisito para que as telas de sugestões renderizem conteúdo.

---

## Dados Mock — KeepSolo (`mocks/keep-solo/src/data/content.ts`)

Adicionar 4 ContentItems com `source: 'ai'` ao array existente. Perfil: Cia Cuidadores (Saúde & Bem-estar).

```ts
// Sugestões de IA — gerados pelo agente com base no perfil Cia Cuidadores
{
  id: 'AI-SOLO-001',
  title: '5 sinais de que seu familiar precisa de um cuidador profissional',
  type: 'post',
  channel: 'Instagram',
  status: 'rascunho',
  source: 'ai',
  briefing: 'Carrossel educativo com 5 sinais de alerta. Tom acolhedor, sem alarme. Encerrar com CTA para contato. Hashtags: #cuidadodomiciliar #cuidadores #saúde #terceiraidade',
  targetDate: '2026-04-14',
  createdAt: '2026-04-08T06:00:00Z',
  aiSuggestionId: 'SUG-SOLO-001',
},
{
  id: 'AI-SOLO-002',
  title: 'Depoimento: como a Dona Maria recuperou a autonomia com acompanhamento diário',
  type: 'post',
  channel: 'Instagram',
  status: 'rascunho',
  source: 'ai',
  briefing: 'Post de storytelling com depoimento fictício mas verossímil. Foto sugerida: idosa sorrindo em ambiente doméstico. Tom amigável e empático. Hashtags: #cuidadohumanizado #históriareal #ciacuidadores',
  targetDate: '2026-04-16',
  createdAt: '2026-04-08T06:05:00Z',
  aiSuggestionId: 'SUG-SOLO-002',
},
{
  id: 'AI-SOLO-003',
  title: 'Checklist: como preparar a casa para receber um cuidador',
  type: 'artigo',
  channel: 'Blog',
  status: 'rascunho',
  source: 'ai',
  briefing: 'Artigo prático com checklist de 8 itens para famílias que vão receber um cuidador pela primeira vez. SEO: "cuidador domiciliar preparação". Tom informativo e amigável.',
  targetDate: '2026-04-18',
  createdAt: '2026-04-08T06:10:00Z',
  aiSuggestionId: 'SUG-SOLO-003',
},
{
  id: 'AI-SOLO-004',
  title: 'Dia do Cuidador — homenagem a quem cuida com amor',
  type: 'short',
  channel: 'TikTok',
  status: 'rascunho',
  source: 'ai',
  briefing: 'Vídeo curto (30s) com montagem de fotos de cuidadores em ação. Trilha emocional. Texto overlay: "Cuidar é um ato de amor". CTA: marque um cuidador que merece reconhecimento.',
  targetDate: '2026-04-20',
  createdAt: '2026-04-08T06:15:00Z',
  aiSuggestionId: 'SUG-SOLO-004',
},
```

---

## Dados Mock — KeepBiz (`mocks/keep-biz/src/data/content.ts`)

Adicionar 3 ContentItems para PRF-001 (Processa Sistemas) e 3 para PRF-002 (Processa Academy):

### PRF-001 — Processa Sistemas (nicho: ERP / Tecnologia)

```ts
{
  id: 'AI-BIZ-001',
  title: 'Como um ERP on-premise reduz custos operacionais em 30%',
  type: 'post',
  platform: 'LinkedIn',
  status: 'rascunho',
  source: 'ai',
  author: 'Agente IA',
  briefing: 'Post técnico para LinkedIn com dados de caso fictício. Tom: técnico e confiante. Público: gestores de PME. Hashtags: #ERP #gestãoempresarial #PME #automação',
  targetDate: '2026-04-14',
  createdAt: '2026-04-08T06:00:00Z',
  statusHistory: [{ status: 'rascunho', timestamp: '2026-04-08T06:00:00Z', by: 'Agente IA' }],
  profileId: 'PRF-001',
  aiSuggestionId: 'SUG-BIZ-001',
},
{
  id: 'AI-BIZ-002',
  title: '3 erros que PMEs cometem ao escolher um sistema de gestão',
  type: 'post',
  platform: 'Instagram',
  status: 'rascunho',
  source: 'ai',
  author: 'Agente IA',
  briefing: 'Carrossel educativo. 3 slides com erros comuns + 1 slide com solução (Processa). Tom: acessível mas técnico. Hashtags: #ERP #erroscomuns #gestão #processasistemas',
  targetDate: '2026-04-17',
  createdAt: '2026-04-08T06:05:00Z',
  statusHistory: [{ status: 'rascunho', timestamp: '2026-04-08T06:05:00Z', by: 'Agente IA' }],
  profileId: 'PRF-001',
  aiSuggestionId: 'SUG-BIZ-002',
},
{
  id: 'AI-BIZ-003',
  title: 'Case: implantação do Processa ERP na indústria alimentícia',
  type: 'campanha',
  platform: 'Multi',
  status: 'rascunho',
  source: 'ai',
  author: 'Agente IA',
  briefing: 'Série de 3 posts contando a jornada de um cliente fictício do setor alimentício. Post 1: problema. Post 2: implantação. Post 3: resultados. Tom: narrativo e técnico.',
  targetDate: '2026-04-21',
  createdAt: '2026-04-08T06:10:00Z',
  statusHistory: [{ status: 'rascunho', timestamp: '2026-04-08T06:10:00Z', by: 'Agente IA' }],
  profileId: 'PRF-001',
  campaignId: 'CMP-AI-001',
  aiSuggestionId: 'SUG-BIZ-003',
},
```

### PRF-002 — Processa Academy (nicho: Educação & Tecnologia)

```ts
{
  id: 'AI-BIZ-004',
  title: 'Webinar gratuito: Dominando relatórios financeiros no ERP',
  type: 'criativo',
  platform: 'LinkedIn',
  status: 'rascunho',
  source: 'ai',
  author: 'Agente IA',
  briefing: 'Anúncio de webinar. Data sugerida: próxima quinta. Chamada para inscrição via link na bio. Tom: amigável e educativo. Hashtags: #webinar #ERP #capacitação #processaacademy',
  targetDate: '2026-04-15',
  createdAt: '2026-04-08T06:20:00Z',
  statusHistory: [{ status: 'rascunho', timestamp: '2026-04-08T06:20:00Z', by: 'Agente IA' }],
  profileId: 'PRF-002',
  aiSuggestionId: 'SUG-BIZ-004',
},
{
  id: 'AI-BIZ-005',
  title: '5 funcionalidades do ERP que sua equipe não usa (mas deveria)',
  type: 'short',
  platform: 'Instagram',
  status: 'rascunho',
  source: 'ai',
  author: 'Agente IA',
  briefing: 'Reels com dicas rápidas. Cada funcionalidade em 5s. Tom: leve e prático. Música trending. Hashtags: #dicas #ERP #produtividade #treinamento',
  targetDate: '2026-04-19',
  createdAt: '2026-04-08T06:25:00Z',
  statusHistory: [{ status: 'rascunho', timestamp: '2026-04-08T06:25:00Z', by: 'Agente IA' }],
  profileId: 'PRF-002',
  aiSuggestionId: 'SUG-BIZ-005',
},
{
  id: 'AI-BIZ-006',
  title: 'Depoimento de aluno: "Aprendi em 2 semanas o que levaria meses sozinho"',
  type: 'post',
  platform: 'Instagram',
  status: 'rascunho',
  source: 'ai',
  author: 'Agente IA',
  briefing: 'Post de prova social com depoimento fictício de aluno. Foto sugerida: pessoa sorrindo em frente ao computador. Tom: amigável e inspirador. Hashtags: #aluno #certificação #processaacademy',
  targetDate: '2026-04-22',
  createdAt: '2026-04-08T06:30:00Z',
  statusHistory: [{ status: 'rascunho', timestamp: '2026-04-08T06:30:00Z', by: 'Agente IA' }],
  profileId: 'PRF-002',
  aiSuggestionId: 'SUG-BIZ-006',
},
```

---

## Critérios de Aceite

1. [ ] KeepSolo: 4 ContentItems com `source: 'ai'`, `status: 'rascunho'` adicionados
2. [ ] KeepBiz: 3 ContentItems para PRF-001 + 3 para PRF-002, todos com `source: 'ai'`
3. [ ] Briefings são realistas, alinhados ao nicho e tom do perfil correspondente
4. [ ] Hashtags incluídas nos briefings
5. [ ] `aiSuggestionId` preenchido em todos os novos itens
6. [ ] Ao menos 1 item no KeepBiz tem `campaignId` (vinculado a campanha AI)
7. [ ] TypeScript compila sem erros
