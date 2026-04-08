# S-034 — Fluxo Aprovar / Editar / Rejeitar Sugestões de IA

**Discoveries:** D-050
**Passada:** 2 (Interação)
**Prioridade:** 10
**Depende de:** S-031, S-033

---

## Objetivo

Implementar as 3 ações do fluxo de autocriação em ambos os apps: o usuário pode aprovar, editar ou rejeitar cada sugestão de conteúdo gerada pela IA. Este é o core funcional do conceito — sem ele as sugestões são read-only.

---

## State Management

### Hook `useContentActions` (`src/hooks/useContentActions.ts`)

Em cada app, criar um hook que gerencia o estado local dos ContentItems (mock — sem backend):

```ts
interface UseContentActions {
  contents: ContentItem[];
  aiSuggestions: ContentItem[];         // filtro: source === 'ai' && status === 'rascunho'
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
}
```

- **Inicializado** com o array de mock data (incluindo os novos itens AI do S-032)
- Estado via `useState` — sem persistência (é mock)

---

## Ação: Aprovar

1. Encontra o item por `id`
2. Altera `status` para `'aprovado'`
3. Mantém `source: 'ai'` (preserva rastreabilidade)
4. No KeepBiz: adiciona entrada ao `statusHistory`
5. Card migra da seção "Sugestões" para a lista principal de conteúdo
6. Toast de confirmação: "Sugestão aprovada! ✓"

---

## Ação: Editar

1. Abre dialog/modal pré-preenchido com dados do item AI:
   - Título (editável)
   - Briefing (editável, textarea)
   - Canal/Plataforma (select, pré-selecionado)
   - Data alvo (date picker, pré-preenchido)
2. Ao salvar: atualiza o item com `status: 'aprovado'`, mantém `source: 'ai'`
3. Dialog reutiliza componente de criação existente quando possível (KeepSolo: `CreateDialog` / KeepBiz: dialog de conteúdo existente)
4. Toast: "Sugestão editada e aprovada!"

---

## Ação: Rejeitar

1. Toast de confirmação com undo (5 segundos): "Sugestão rejeitada" + botão "Desfazer"
2. Se não desfeito: remove o item da lista (ou marca com status especial `'rejeitado'` sem exibir)
3. Card desaparece da seção de sugestões com animação fade-out

---

## Integração nos Cards

### KeepSolo — `AiSuggestionCard` (criado em S-033)

Conectar os handlers dos 3 botões do card ao `useContentActions`:

- Botão verde `Check` → `approveSuggestion(id)`
- Botão azul `PencilSimple` → abre dialog de edição
- Botão vermelho `X` → `rejectSuggestion(id)`

### KeepBiz — `AiSuggestionCard` (equivalente, criado em S-035)

Mesmos handlers, mesmos ícones, integrados via `useContentActions` do KeepBiz.

---

## Critérios de Aceite

1. [ ] Hook `useContentActions` criado em ambos os apps
2. [ ] Aprovar: muda status para 'aprovado', card migra para lista principal
3. [ ] Editar: abre dialog pré-preenchido, ao salvar marca como aprovado
4. [ ] Rejeitar: remove da lista de sugestões com toast undo
5. [ ] Toasts de feedback para cada ação
6. [ ] `source: 'ai'` preservado após aprovação (não vira 'manual')
7. [ ] KeepBiz: `statusHistory` atualizado na aprovação
8. [ ] Fluxo funcional em ambos os apps
