# PRP-028 — Tipos e Dados de Autocriação

**Passada:** 5 — Autocriação
**Specs:** S-031, S-032
**Discoveries:** D-047, D-048
**Prioridade:** 10

---

## Objetivo

Criar a fundação de dados para o conceito de autocriação em ambos os apps (KeepBiz e KeepSolo). Adicionar o campo `source` ao tipo `ContentItem` para distinguir conteúdo manual de conteúdo gerado pela IA, campos auxiliares de vínculo a campanhas, e dados mock de sugestões de IA realistas alinhados ao perfil/nicho de cada negócio. Este PRP é pré-requisito para todos os demais do sprint 5.

## Escopo

### Tipos (`src/data/types.ts`) — ambos os apps

- `ContentSource`: union `'ai' | 'manual'`
- Campo `source: ContentSource` obrigatório em `ContentItem`
- Campo `campaignId?: string` opcional — vínculo com campanha AI
- Campo `aiSuggestionId?: string` opcional — rastreio da sugestão original

### Migração de Mock Existente — ambos os apps

Todos os `ContentItem` existentes nos arquivos de mock data recebem `source: 'manual'`. Nenhum item existente deve ficar sem o campo.

### Mock Data KeepSolo (`src/data/content.ts`)

4 ContentItems com `source: 'ai'`, `status: 'rascunho'` alinhados ao perfil Cia Cuidadores (Saúde & Bem-estar):
- AI-SOLO-001: carrossel educativo sobre sinais de necessidade de cuidador
- AI-SOLO-002: storytelling com depoimento fictício
- AI-SOLO-003: artigo checklist para famílias
- AI-SOLO-004: short TikTok para Dia do Cuidador

### Mock Data KeepBiz (`src/data/content.ts`)

3 ContentItems para PRF-001 (Processa Sistemas / ERP) + 3 para PRF-002 (Processa Academy / Educação):
- PRF-001: post LinkedIn técnico, carrossel Instagram, série case study (com `campaignId`)
- PRF-002: anúncio de webinar, Reels com dicas, depoimento de aluno

Todos com `source: 'ai'`, `status: 'rascunho'`, `author: 'Agente IA'`, `aiSuggestionId` preenchido, briefings com hashtags.

## Features

1. **F-028-A**: Tipo `ContentSource` e campos `source`, `campaignId?`, `aiSuggestionId?` em `types.ts` de ambos os apps
2. **F-028-B**: Migração — adicionar `source: 'manual'` a todos os ContentItems mock existentes em ambos os apps
3. **F-028-C**: Mock data KeepSolo — 4 ContentItems AI com briefings realistas para Cia Cuidadores
4. **F-028-D**: Mock data KeepBiz — 6 ContentItems AI (3 por perfil) com briefings realistas, 1 com campaignId

## Limites

- NÃO criar componentes de UI — apenas tipos e dados
- NÃO criar o tipo `AiCampaign` — será feito no PRP-031
- NÃO alterar lógica de renderização das páginas existentes
- Briefings devem ser realistas e alinhados ao nicho de cada perfil

## Dependências

- Nenhuma — este é o PRP base do sprint 5
