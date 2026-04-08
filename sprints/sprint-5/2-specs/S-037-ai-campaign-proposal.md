# S-037 — Campanha Proposta Automaticamente pela IA

**Discoveries:** D-053
**Passada:** 3 (Feature)
**Prioridade:** 9
**Depende de:** S-031, S-032, S-034

---

## Objetivo

Implementar o clímax visual do sprint-5: o agente propõe uma campanha completa (série de posts com tema, datas e objetivo). O usuário pode aceitar a campanha inteira, personalizar ou dispensar. É o momento em que o sistema demonstra planejamento autônomo, não apenas criação de posts avulsos.

---

## Tipo de Dados

### Tipo `AiCampaign`

Adicionar em `types.ts` de ambos os apps:

```ts
export type CampaignObjective = 'alcance' | 'engajamento' | 'conversao';

export interface AiCampaignPost {
  title: string;
  briefing: string;
  platform: ContentPlatform;   // KeepBiz
  // channel: ContentChannel;  // KeepSolo
  targetDate: string;
}

export interface AiCampaign {
  id: string;                    // ex: "CMP-AI-001"
  title: string;
  description: string;
  objective: CampaignObjective;
  posts: AiCampaignPost[];       // 3-5 posts planejados
  profileId?: string;            // KeepBiz: vinculado ao perfil
  source: 'ai';
  status: 'proposta' | 'aceita' | 'dispensada';
  createdAt: string;
}
```

---

## Mock Data

### KeepBiz — 1 campanha para PRF-001

```ts
{
  id: 'CMP-AI-001',
  title: 'Série: Transformação Digital para PMEs',
  description: 'Campanha educativa em 4 posts mostrando a jornada de digitalização de uma PME com ERP. Objetivo: posicionar Processa Sistemas como parceiro de transformação.',
  objective: 'engajamento',
  posts: [
    { title: 'O que é transformação digital (de verdade)?', briefing: '...', platform: 'LinkedIn', targetDate: '2026-04-21' },
    { title: 'Os 3 primeiros passos para digitalizar sua PME', briefing: '...', platform: 'LinkedIn', targetDate: '2026-04-23' },
    { title: 'Case: como a indústria X saiu do Excel para o ERP', briefing: '...', platform: 'Instagram', targetDate: '2026-04-25' },
    { title: 'Checklist: sua empresa está pronta para o próximo passo?', briefing: '...', platform: 'Multi', targetDate: '2026-04-28' },
  ],
  profileId: 'PRF-001',
  source: 'ai',
  status: 'proposta',
  createdAt: '2026-04-08T05:00:00Z',
}
```

### KeepSolo — 1 campanha

```ts
{
  id: 'CMP-AI-SOLO-001',
  title: 'Semana do Cuidador: Valorizando Quem Cuida',
  description: 'Série de 3 conteúdos para a Semana do Cuidador. Objetivo: humanizar a marca e gerar engajamento com famílias.',
  objective: 'engajamento',
  posts: [
    { title: 'O dia a dia de um cuidador profissional', briefing: '...', channel: 'Instagram', targetDate: '2026-04-21' },
    { title: 'Como escolher o cuidador certo para sua família', briefing: '...', channel: 'Blog', targetDate: '2026-04-23' },
    { title: 'Homenagem: cuidar é um ato de amor', briefing: '...', channel: 'TikTok', targetDate: '2026-04-25' },
  ],
  source: 'ai',
  status: 'proposta',
  createdAt: '2026-04-08T05:00:00Z',
}
```

---

## UI — KeepBiz (`ContentPage`)

### Card de Campanha Proposta

Posicionado acima da seção de sugestões individuais (ou como primeiro item destacado):

- **Visual**: card expandido, largura full, borda left grossa em violeta, background gradient sutil
- **Header**: ícone `Megaphone` + título da campanha + badge "Campanha IA"
- **Body**: descrição + objetivo (badge: alcance/engajamento/conversão) + lista vertical dos posts planejados (título + plataforma + data)
- **Ações**:
  - **"Aceitar campanha"** (botão primário): cria todos os posts como ContentItems com `source: 'ai'`, `status: 'rascunho'`, `campaignId: campaign.id`. Campanha muda para `status: 'aceita'`. Toast: "Campanha aceita! X posts criados como rascunho."
  - **"Personalizar"** (botão secundário): abre dialog com campos editáveis (título, posts, datas). Ao salvar, cria os posts ajustados.
  - **"Dispensar"** (botão ghost/text): campanha muda para `status: 'dispensada'`, card desaparece com confirmação toast + undo.

---

## UI — KeepSolo (`CreatePage`)

### Banner de Campanha

Versão simplificada acima da seção "Sugestões para você":

- Card com visual similar mas mais compacto (não mostra lista completa de posts)
- Título da campanha + descrição + contagem de posts ("3 posts planejados")
- Botões: "Aceitar" / "Ver detalhes" / "Dispensar"
- "Ver detalhes": expande inline mostrando a lista de posts

---

## Critérios de Aceite

1. [ ] Tipo `AiCampaign` e `AiCampaignPost` adicionados em `types.ts` de ambos os apps
2. [ ] Mock data de 1 campanha proposta em cada app
3. [ ] KeepBiz: card expandido de campanha na ContentPage com 3 ações
4. [ ] KeepSolo: banner simplificado de campanha na CreatePage
5. [ ] "Aceitar campanha": cria ContentItems com source='ai', status='rascunho', campaignId correto
6. [ ] "Personalizar": abre dialog de edição dos posts da campanha
7. [ ] "Dispensar": remove com toast undo
8. [ ] Campanha não reaparece após ser aceita ou dispensada
