# PRP-029 — KeepSolo: Sugestões e Aprovação

**Passada:** 5 — Autocriação
**Specs:** S-033, S-034
**Discoveries:** D-049, D-050
**Prioridade:** 10

---

## Objetivo

Implementar o fluxo completo de autocriação no KeepSolo: seção "Sugestões para você" no topo da CreatePage com cards de conteúdo gerado pela IA, e as 3 ações do fluxo (Aprovar / Editar / Rejeitar). Após este PRP, o usuário KeepSolo pode ver, revisar e agir sobre sugestões da IA.

## Escopo

### Componente `AiSuggestionCard` (`src/components/AiSuggestionCard.tsx`)

Card reutilizável para exibir sugestão de IA:
- Borda left em amber/violeta (4px), fundo diferenciado (`bg-amber-50` / dark: `bg-amber-950/20`)
- Badge ícone `Robot` + texto "IA" em violeta (canto superior direito)
- Conteúdo: título, tipo (post/short/artigo), canal, data sugerida
- Preview do briefing: 2 linhas truncadas
- 3 botões inline no rodapé: Aprovar (verde `Check`) / Editar (azul `PencilSimple`) / Rejeitar (vermelho `X`)

### Seção "Sugestões para você" (`CreatePage.tsx`)

- Inserida acima da grid/lista de conteúdo existente
- Header: ícone `Sparkle` + "Sugestões para você" + badge contagem ("X novas")
- Renderiza apenas quando há itens `source === 'ai'` && `status === 'rascunho'`; quando vazia, não aparece
- Mobile (< 768px): scroll horizontal com snap-to-card (~280px)
- Desktop (≥ 768px): grid 2 colunas
- Divider "Seu conteúdo" separa sugestões da lista manual existente

### Hook `useContentActions` (`src/hooks/useContentActions.ts`)

State management local para o fluxo de sugestões (mock, sem backend):

```ts
interface UseContentActions {
  contents: ContentItem[];
  aiSuggestions: ContentItem[];        // source === 'ai' && status === 'rascunho'
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
}
```

### Ação Aprovar

- Altera `status` para `'aprovado'`, mantém `source: 'ai'`
- Card migra da seção "Sugestões" para a lista principal
- Toast: "Sugestão aprovada! ✓"

### Ação Editar

- Abre dialog pré-preenchido (título, briefing, canal, data alvo)
- Reutiliza `CreateDialog` existente quando possível
- Ao salvar: `status: 'aprovado'`, mantém `source: 'ai'`
- Toast: "Sugestão editada e aprovada!"

### Ação Rejeitar

- Toast com undo (5s): "Sugestão rejeitada" + botão "Desfazer"
- Se não desfeito: remove da lista
- Fade-out no card

## Features

1. **F-029-A**: Componente `AiSuggestionCard` com visual diferenciado, badge IA e 3 botões de ação
2. **F-029-B**: Seção "Sugestões para você" na CreatePage com layout responsivo (scroll horizontal mobile, grid 2-col desktop) e divider
3. **F-029-C**: Hook `useContentActions` com state management e filtro `aiSuggestions`
4. **F-029-D**: Ação Aprovar — muda status, migra card, toast de feedback
5. **F-029-E**: Ação Editar — dialog pré-preenchido, salva como aprovado, toast
6. **F-029-F**: Ação Rejeitar — remove com toast undo e animação fade-out

## Limites

- NÃO persistir estado além do React state (não sobrevive a reload)
- NÃO alterar a lista/grid de conteúdo existente (apenas adicionar seção acima)
- `source: 'ai'` NUNCA muda para `'manual'` após aprovação

## Dependências

- **PRP-028** — tipos `ContentSource` e mock data AI devem existir
