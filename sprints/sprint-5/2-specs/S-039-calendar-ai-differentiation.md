# S-039 — Calendário Diferenciando IA vs Manual

**Discoveries:** D-055
**Passada:** 3 (Polimento)
**Prioridade:** 8
**Depende de:** S-031, S-034

---

## Objetivo

Diferenciar visualmente no calendário editorial os eventos de conteúdo manual (confirmados) dos eventos de conteúdo sugerido pela IA (aguardando aprovação). Sugestões de IA aparecem como "slots planejados" com visual distinto e ações inline.

---

## Páginas Afetadas

- **KeepSolo**: calendário em `CreatePage` (ou `CreateCalendarPage` se existir separado)
- **KeepBiz**: calendário em `ContentPage` (ou `ContentCalendarPage`)

---

## Visual

### Eventos de conteúdo manual (`source: 'manual'`)

- Comportamento atual mantido (ponto sólido, cor da plataforma/canal)
- Sem alterações

### Eventos de conteúdo IA (`source: 'ai'`, `status: 'rascunho'`)

- **Borda pontilhada** (`border-dashed`) no slot do dia
- **Ícone Robot** pequeno (12px) ao lado do título
- **Cor diferenciada**: violeta/roxo (contraste com as cores normais)
- **Opacidade levemente reduzida** (opacity-80) para indicar "pendente"

### Tooltip / Popover ao clicar no evento IA

- Exibe título + briefing (2 linhas)
- 3 botões: Aprovar / Editar / Rejeitar (reutiliza handlers do `useContentActions` de S-034)
- Fluxo idêntico ao dos cards de sugestão

### Legenda

No topo do calendário, adicionar legenda simples:

- `●` Conteúdo confirmado
- `○` Sugestão da IA (aguardando aprovação)

---

## Critérios de Aceite

1. [ ] Eventos AI no calendário têm borda pontilhada + ícone Robot
2. [ ] Cor violeta diferencia eventos AI dos manuais
3. [ ] Popover/tooltip no evento AI com Aprovar/Editar/Rejeitar
4. [ ] Legenda no topo do calendário
5. [ ] Após aprovar via calendário, evento muda para visual sólido (confirmado)
6. [ ] Funcional em ambos os apps
