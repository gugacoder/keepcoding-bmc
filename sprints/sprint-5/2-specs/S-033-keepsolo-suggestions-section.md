# S-033 — KeepSolo: Seção "Sugestões para você" na CreatePage

**Discoveries:** D-049
**Passada:** 2 (Telas)
**Prioridade:** 10
**Depende de:** S-031, S-032

---

## Objetivo

Adicionar uma seção destacada no topo da CreatePage do KeepSolo que exibe conteúdo sugerido pela IA (`source: 'ai'`, `status: 'rascunho'`). A seção é o entry point visual do conceito de autocriação — mostra ao usuário que o sistema já trabalhou antes dele abrir a tela.

---

## Localização

`mocks/keep-solo/src/pages/CreatePage.tsx` — seção inserida acima da grid/lista de conteúdo existente.

---

## Layout

### Seção "Sugestões para você"

- **Header**: ícone `Sparkle` ou `Robot` + título "Sugestões para você" + badge com contagem (ex: "4 novas")
- **Visibilidade**: renderiza **apenas** quando existem itens com `source === 'ai'` e `status === 'rascunho'`. Quando vazia, a seção simplesmente não aparece (sem empty state).
- **Mobile** (< 768px): scroll horizontal com cards de largura fixa (~280px), snap-to-card
- **Desktop** (≥ 768px): grid de 2 colunas

### Card de Sugestão (`AiSuggestionCard`)

Componente reutilizável em `src/components/AiSuggestionCard.tsx`:

- **Visual diferenciado**: borda left em amber/violeta (4px), fundo levemente diferente (`bg-amber-50` / dark: `bg-amber-950/20`)
- **Badge**: ícone `Robot` + texto "IA" em violeta, posicionado no canto superior direito
- **Conteúdo**: título, tipo de conteúdo (post/short/artigo), canal, data sugerida
- **Preview do briefing**: 2 linhas truncadas do briefing
- **Ações** (3 botões inline no rodapé do card): Aprovar / Editar / Rejeitar (implementação dos handlers em S-034)
  - Botões renderizam mas handlers ficam como `() => {}` nesta spec — lógica completa em S-034

---

## Separador Visual

Após a seção de sugestões (quando presente), uma divider line sutil com label "Seu conteúdo" separa das sugestões e da lista de conteúdo manual existente.

---

## Critérios de Aceite

1. [ ] Seção "Sugestões para você" aparece no topo da CreatePage quando há itens AI rascunho
2. [ ] Seção desaparece quando não há sugestões pendentes
3. [ ] Cards com visual diferenciado (borda, badge IA, fundo)
4. [ ] Mobile: scroll horizontal com snap
5. [ ] Desktop: grid 2 colunas
6. [ ] Badge de contagem no header da seção
7. [ ] Botões Aprovar/Editar/Rejeitar visíveis nos cards (handlers em S-034)
8. [ ] Componente `AiSuggestionCard` extraído e reutilizável
9. [ ] Divider "Seu conteúdo" entre sugestões e lista manual
10. [ ] i18n: strings em pt/en/es (ou delegado a S-041)
