# PRP-033 — Calendário: Diferenciação IA vs Manual

**Passada:** 5 — Autocriação
**Specs:** S-039
**Discoveries:** D-055
**Prioridade:** 8

---

## Objetivo

Diferenciar visualmente no calendário editorial os eventos de conteúdo manual (confirmados) dos eventos de conteúdo sugerido pela IA (aguardando aprovação). Sugestões de IA aparecem como "slots planejados" com visual distinto e ações inline de aprovação diretamente no calendário.

## Escopo

### Páginas Afetadas

- **KeepSolo**: calendário em CreatePage (ou CreateCalendarPage)
- **KeepBiz**: calendário em ContentPage (ou ContentCalendarPage)

### Eventos de Conteúdo Manual (`source: 'manual'`)

Comportamento atual mantido — sem alterações.

### Eventos de Conteúdo IA (`source: 'ai'`, `status: 'rascunho'`)

- **Borda pontilhada** (`border-dashed`) no slot do dia
- **Ícone Robot** pequeno (12px) ao lado do título
- **Cor violeta/roxa** (contraste com cores normais de plataforma/canal)
- **Opacidade reduzida** (`opacity-80`) para indicar "pendente"

### Tooltip / Popover ao Clicar

Ao clicar num evento IA no calendário:
- Exibe título + briefing (2 linhas)
- 3 botões: Aprovar / Editar / Rejeitar (reutiliza handlers do `useContentActions`)
- Após aprovar via calendário: evento muda para visual sólido (confirmado)

### Legenda

No topo do calendário, legenda simples:
- `●` Conteúdo confirmado
- `○` Sugestão da IA (aguardando aprovação)

## Features

1. **F-033-A**: Visual diferenciado para eventos AI no calendário — borda pontilhada, ícone Robot, cor violeta, opacidade reduzida
2. **F-033-B**: Popover/tooltip no evento AI com título, briefing e botões Aprovar/Editar/Rejeitar
3. **F-033-C**: Legenda no topo do calendário diferenciando confirmado vs sugestão IA
4. **F-033-D**: Implementação em ambos os apps (KeepSolo e KeepBiz)

## Limites

- NÃO alterar a estrutura do calendário existente — apenas adicionar diferenciação visual
- NÃO criar novo componente de calendário — usar o existente
- Após aprovação via popover, o evento deve atualizar visualmente na mesma sessão

## Dependências

- **PRP-028** — campo `source` em ContentItem
- **PRP-029** — `useContentActions` no KeepSolo (para handlers)
- **PRP-030** — `useContentActions` no KeepBiz (para handlers)
