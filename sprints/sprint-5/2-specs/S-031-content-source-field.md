# S-031 — Campo `source` no ContentItem

**Discoveries:** D-047
**Passada:** 1 (Dados)
**Prioridade:** 10
**Depende de:** —

---

## Objetivo

Adicionar campo `source` ao tipo `ContentItem` em ambos os apps para distinguir conteúdo criado pelo usuário (`manual`) de conteúdo gerado pelo agente (`ai`). Adicionar campos auxiliares para vincular posts a campanhas e rastrear a sugestão original. Todos os itens mock existentes recebem `source: 'manual'` por default.

---

## Alterações de Tipo

### KeepBiz (`mocks/keep-biz/src/data/types.ts`)

Adicionar ao `ContentItem`:

```ts
export type ContentSource = 'ai' | 'manual';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  platform: ContentPlatform;
  status: ContentStatus;
  source: ContentSource;             // NOVO — origem do conteúdo
  author: string;
  briefing: string;
  targetDate: string;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
  thumbnail?: string;
  profileId?: string;
  campaignId?: string;               // NOVO — vínculo com campanha
  aiSuggestionId?: string;           // NOVO — ID original da sugestão
}
```

### KeepSolo (`mocks/keep-solo/src/data/types.ts`)

Adicionar ao `ContentItem`:

```ts
export type ContentSource = 'ai' | 'manual';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  channel: ContentChannel;
  status: ContentStatus;
  source: ContentSource;             // NOVO — origem do conteúdo
  briefing: string;
  targetDate: string;
  createdAt: string;
  views?: number;
  clicks?: number;
  engagement?: number;
  thumbnail?: string;
  campaignId?: string;               // NOVO — vínculo com campanha
  aiSuggestionId?: string;           // NOVO — ID original da sugestão
}
```

---

## Migração de Dados Mock Existentes

Adicionar `source: 'manual'` a **todos** os `ContentItem` existentes nos arquivos de mock data de ambos os apps. Nenhum item existente deve ficar sem o campo.

---

## Critérios de Aceite

1. [ ] Tipo `ContentSource` exportado em `types.ts` de ambos os apps
2. [ ] Campo `source` obrigatório em `ContentItem` de ambos os apps
3. [ ] Campos `campaignId?` e `aiSuggestionId?` opcionais em ambos os apps
4. [ ] Todos os ContentItems mock existentes recebem `source: 'manual'`
5. [ ] TypeScript compila sem erros em ambos os apps
