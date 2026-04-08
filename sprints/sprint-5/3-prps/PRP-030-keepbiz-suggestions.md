# PRP-030 — KeepBiz: Sugestões e Aprovação

**Passada:** 5 — Autocriação
**Specs:** S-035, S-034, S-040
**Discoveries:** D-050, D-051, D-056
**Prioridade:** 9

---

## Objetivo

Implementar o fluxo de autocriação no KeepBiz: seção "Sugestões da IA" na ContentPage integrada ao ProfileSelector existente, com visão por perfil e visão consolidada. O gestor pode aprovar, editar ou rejeitar sugestões de cada perfil separadamente ou em batch. Este PRP diferencia o KeepBiz do KeepSolo pela dimensão multi-perfil.

## Escopo

### Seção "Sugestões da IA" (`ContentPage.tsx`)

- Inserida acima da lista/grid de conteúdo existente, abaixo do ProfileSelector
- Header: ícone `Robot` + "Sugestões da IA" + badge contagem
- Renderiza apenas quando há itens `source === 'ai'` && `status === 'rascunho'` para o contexto de perfil
- Desktop: grid 3 colunas; Mobile: scroll horizontal com snap
- Divider "Conteúdo existente" separa sugestões da lista principal

### Integração com ProfileSelector

- **Perfil específico selecionado**: filtra sugestões por `profileId`
- **"Todos os perfis"**: exibe todas as sugestões

### Card de Sugestão (variante KeepBiz)

Componente `AiSuggestionCard` em `src/components/AiSuggestionCard.tsx`:
- Borda left em azul/violeta (cores frias KeepBiz)
- Badge de perfil no card (nome do perfil, ex: "Processa Sistemas") — visível principalmente no modo "Todos"
- Mesmos 3 botões: Aprovar / Editar / Rejeitar

### Hook `useContentActions` (`src/hooks/useContentActions.ts`)

Mesmo padrão do KeepSolo, com adições:
- `statusHistory` atualizado na aprovação (com timestamp e `by: 'Usuário'`)
- Filtro por `profileId` para sugestões do perfil selecionado

### Visão Consolidada ("Todos os perfis")

Quando ProfileSelector está em "Todos os perfis":
- Sugestões agrupadas por perfil com headers expandíveis
- Header por perfil: nome + contagem de sugestões (ex: "Processa Sistemas — 3 sugestões ▾")
- Toggle expand/collapse (default: expandido)
- Contador total no header geral da seção

### Quando perfil específico selecionado

Lista flat sem agrupamento — comportamento simples.

### Ações (Aprovar / Editar / Rejeitar)

- Mesma lógica do PRP-029 adaptada ao KeepBiz:
  - Aprovar: `status → 'aprovado'`, atualiza `statusHistory`, toast
  - Editar: dialog pré-preenchido, reutiliza dialog existente do ContentPage quando possível
  - Rejeitar: remove com toast undo

## Features

1. **F-030-A**: Seção "Sugestões da IA" na ContentPage com layout responsivo (grid 3-col desktop, scroll mobile)
2. **F-030-B**: `AiSuggestionCard` KeepBiz com visual frio e badge de perfil
3. **F-030-C**: Hook `useContentActions` KeepBiz com filtro por `profileId` e `statusHistory`
4. **F-030-D**: Integração com ProfileSelector — filtragem por perfil
5. **F-030-E**: Visão consolidada "Todos os perfis" — agrupamento por perfil com headers expandíveis e contador total
6. **F-030-F**: Ações Aprovar/Editar/Rejeitar com toasts e atualização de `statusHistory`

## Limites

- NÃO alterar o ProfileSelector existente — apenas consumir seu estado
- NÃO persistir estado além do React state
- Aprovar/rejeitar de um perfil NÃO afeta sugestões de outro perfil
- `source: 'ai'` NUNCA muda para `'manual'` após aprovação

## Dependências

- **PRP-028** — tipos `ContentSource` e mock data AI devem existir
