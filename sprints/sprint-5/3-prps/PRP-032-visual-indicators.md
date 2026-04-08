# PRP-032 — Indicadores Visuais de Autocriação

**Passada:** 5 — Autocriação
**Specs:** S-036, S-038
**Discoveries:** D-052, D-054
**Prioridade:** 9

---

## Objetivo

Adicionar indicadores visuais que tornam a autocriação perceptível em toda a UI: badge "IA" nos cards de conteúdo aprovado e indicadores de atividade do agente na Orchestrator Bar (KeepBiz) e bottom nav (KeepSolo). Sem esses elementos, o diferencial de autocriação se torna invisível após a aprovação e o sistema parece passivo.

## Escopo

### Componente `SourceBadge` (`src/components/SourceBadge.tsx`) — ambos os apps

Badge que indica a origem do conteúdo:

- **`source === 'ai'`**: ícone `Robot` + texto "IA", cor violeta (`text-violet-600`, `bg-violet-100` / dark: `bg-violet-900/30`), tamanho small (`text-xs`, `px-2 py-0.5`, `rounded-full`)
- **`source === 'manual'`**: não renderiza nada (manual é o padrão silencioso)

### Integração nos Cards de Conteúdo

- **KeepSolo (`CreatePage`)**: `SourceBadge` no header dos cards da grid principal, ao lado do status badge
- **KeepBiz (`ContentPage`)**: `SourceBadge` nos cards/thumbnails da lista principal, ao lado dos badges existentes
- Badge visível apenas na lista principal (não na seção de sugestões, que já tem visual diferenciado)

### KeepBiz — Orchestrator Bar (`OrchestratorBar.tsx`)

Quando existem sugestões pendentes (`source: 'ai'`, `status: 'rascunho'`):
- Texto animado ao lado do swarm status: **"Agente criou X sugestões"**
- Ícone `Sparkle` com animação pulse sutil
- Contagem reativa ao estado do `useContentActions`
- Clique: navega para ContentPage
- Sem sugestões pendentes: indicador não aparece

### KeepSolo — Bottom Nav Badge (`BottomNav.tsx`)

No ícone do room "Criar":
- Badge numérico (circle amber/vermelho) com contagem de sugestões AI pendentes
- Aparece apenas quando `count > 0`
- Estilo: notification badge padrão (circle com número, top-right do ícone)
- Contagem reativa ao estado do `useContentActions`

## Features

1. **F-032-A**: Componente `SourceBadge` em ambos os apps com visual violeta para AI e silencioso para manual
2. **F-032-B**: Integração do `SourceBadge` nos cards de conteúdo da lista principal em ambos os apps
3. **F-032-C**: Orchestrator Bar KeepBiz — texto "Agente criou X sugestões" com Sparkle pulse e navegação
4. **F-032-D**: Bottom Nav KeepSolo — badge numérico no ícone "Criar" com contagem de sugestões pendentes

## Limites

- NÃO alterar o visual dos cards na seção de sugestões (que já têm badge IA próprio)
- NÃO mostrar badge "Você criou" para itens manuais (o manual é o default silencioso)
- Dark mode compatível em ambos os componentes

## Dependências

- **PRP-028** — campo `source` em ContentItem
- **PRP-029** — `useContentActions` no KeepSolo (para contagem reativa)
- **PRP-030** — `useContentActions` no KeepBiz (para contagem reativa)
