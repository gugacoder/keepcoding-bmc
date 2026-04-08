# PRP-031 — Campanha Proposta pela IA

**Passada:** 5 — Autocriação
**Specs:** S-037
**Discoveries:** D-053
**Prioridade:** 9

---

## Objetivo

Implementar o clímax visual do sprint-5: o agente propõe campanhas completas (séries de posts com tema, datas e objetivo). O usuário pode aceitar a campanha inteira, personalizar ou dispensar. Este PRP demonstra planejamento autônomo — o sistema não só cria posts avulsos, mas planeja séries de conteúdo.

## Escopo

### Tipos (`src/data/types.ts`) — ambos os apps

```ts
type CampaignObjective = 'alcance' | 'engajamento' | 'conversao';

interface AiCampaignPost {
  title: string;
  briefing: string;
  platform: ContentPlatform;   // KeepBiz
  // channel: ContentChannel;  // KeepSolo
  targetDate: string;
}

interface AiCampaign {
  id: string;
  title: string;
  description: string;
  objective: CampaignObjective;
  posts: AiCampaignPost[];
  profileId?: string;          // KeepBiz
  source: 'ai';
  status: 'proposta' | 'aceita' | 'dispensada';
  createdAt: string;
}
```

### Mock Data

- **KeepBiz**: 1 campanha para PRF-001 — "Série: Transformação Digital para PMEs" (4 posts, objetivo engajamento)
- **KeepSolo**: 1 campanha — "Semana do Cuidador: Valorizando Quem Cuida" (3 posts, objetivo engajamento)

### UI KeepBiz — Card de Campanha (`ContentPage.tsx`)

Posicionado acima da seção de sugestões individuais:
- Card expandido, largura full, borda left grossa em violeta, background gradient sutil
- Header: ícone `Megaphone` + título + badge "Campanha IA"
- Body: descrição + badge de objetivo + lista vertical dos posts planejados (título + plataforma + data)
- **3 ações**:
  - "Aceitar campanha" (primário): cria todos os posts como ContentItems `source: 'ai'`, `status: 'rascunho'`, `campaignId`. Toast: "Campanha aceita! X posts criados."
  - "Personalizar" (secundário): abre dialog com campos editáveis (título, posts, datas)
  - "Dispensar" (ghost): `status: 'dispensada'`, card desaparece com toast undo

### UI KeepSolo — Banner de Campanha (`CreatePage.tsx`)

Versão simplificada acima da seção "Sugestões para você":
- Card compacto: título + descrição + "3 posts planejados"
- Botões: "Aceitar" / "Ver detalhes" (expande inline) / "Dispensar"

## Features

1. **F-031-A**: Tipos `AiCampaign`, `AiCampaignPost`, `CampaignObjective` em `types.ts` de ambos os apps
2. **F-031-B**: Mock data de 1 campanha KeepBiz (PRF-001, 4 posts) e 1 campanha KeepSolo (3 posts)
3. **F-031-C**: Card expandido de campanha na ContentPage KeepBiz com 3 ações
4. **F-031-D**: Banner simplificado de campanha na CreatePage KeepSolo com expand inline
5. **F-031-E**: Lógica "Aceitar campanha" — cria ContentItems a partir dos posts da campanha com `campaignId` correto

## Limites

- NÃO persistir estado além do React state
- Campanha aceita NÃO reaparece após reload (state mock)
- NÃO criar fluxo de criação de campanhas manuais — apenas propostas pela IA

## Dependências

- **PRP-028** — tipos `ContentSource` e campo `campaignId` em ContentItem
- **PRP-029** — `useContentActions` no KeepSolo (para inserir posts da campanha aceita)
- **PRP-030** — `useContentActions` no KeepBiz
