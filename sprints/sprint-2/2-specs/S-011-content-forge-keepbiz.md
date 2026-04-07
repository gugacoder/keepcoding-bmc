# S-011 — Content Forge (KeepBiz)

**Discoveries:** D-016
**Passada:** 3 (Zona 2 — Conteúdo)
**Prioridade:** 6
**Depende de:** S-001, S-002

---

## Objetivo

Implementar o Content Forge do KeepBiz — gestão de conteúdo com lista/grid, status badges, criação via dialog, preview panel com aprovação/revisão/agendamento, swarm indicator, e calendário mensal/semanal.

---

## Rotas

```
/content            → Lista/grid de conteúdo (default)
/content/calendar   → Calendário
/content/new        → Dialog de criação (ou inline)
/content/:id        → Detail/preview panel
```

---

## Lista de Conteúdo (`/content`)

### Layout

Toggle view: Lista (tabela) ou Grid (cards) — botões no header.

**Tabela (lista):**
| Coluna | Tipo |
|---|---|
| Título | string |
| Tipo | badge (post/short/criativo/campanha) |
| Plataforma | ícone + nome |
| Autor | nome (da equipe) |
| Status | badge colorido |
| Data alvo | data formatada |

**Grid (cards):**
Cada card: thumbnail placeholder, título, tipo badge, status badge, plataforma ícone.

### Status Badges

| Status | Cor |
|---|---|
| Rascunho | gray |
| Em revisão | amber |
| Aprovado | blue |
| Agendado | purple |
| Publicado | green |

### Filtro por Status

Pills horizontais: Todos, Rascunho, Em Revisão, Aprovado, Agendado, Publicado. Funcionam como toggle.

### Botão "Nova Campanha"

Abre Dialog de criação (ver abaixo).

---

## Dialog de Criação

Campos:
- **Título**: text input (obrigatório)
- **Tipo**: select (Post, Short, Criativo, Campanha)
- **Plataforma**: select (Instagram, TikTok, LinkedIn, YouTube, Multi)
- **Autor**: select (membros da equipe, de `data/team.ts`)
- **Briefing**: textarea
- **Data alvo**: date picker

Ao submeter:
1. Novo item adicionado ao state com status "rascunho"
2. Aparece na lista/grid
3. Dialog fecha

---

## Preview/Detail Panel (`/content/:id`)

### Layout Desktop

Side panel (Sheet) ou página completa:

```
┌──────────────────────────────────────┐
│ Post: Lançamento de verão            │
│ Instagram  ● Aprovado  João Silva    │
├──────────────────────────────────────┤
│ Briefing:                            │
│ "Campanha visual para lançamento..." │
├──────────────────────────────────────┤
│ Timeline de Status                   │
│ ● Criado (01/03) → ● Em revisão     │
│   (03/03) → ● Aprovado (05/03)      │
├──────────────────────────────────────┤
│ Swarm Indicator                      │
│ 🔬 Research: done  ✏️ Draft: done    │
│ 📅 Schedule: pending                 │
├──────────────────────────────────────┤
│ Ações:                               │
│ [Aprovar] [Solicitar Revisão]        │
│ [Agendar]                            │
└──────────────────────────────────────┘
```

### Ações

- **"Aprovar"**: muda status para "aprovado" → badge atualiza na lista
- **"Solicitar Revisão"**: muda status para "em revisão"
- **"Agendar"**: abre date picker mock → selecionar data → status muda para "agendado" com data
- Botões visíveis conforme estado:
  - Rascunho: Aprovar, Solicitar Revisão
  - Em revisão: Aprovar
  - Aprovado: Agendar
  - Agendado/Publicado: nenhuma ação

### Timeline de Status

Timeline horizontal com dots e linhas:
- Cada status pelo qual o item passou, com data
- Dados de `statusHistory` no item
- Status atual em destaque (cor primária)

### Swarm Indicator

Indicador visual de "quem está fazendo o quê":
- 3 fases: Research → Draft → Schedule
- Cada fase: ícone + label + status (done/in progress/pending)
- Mock: fases completam baseado no status do conteúdo (rascunho = research done, aprovado = draft done, agendado = all done)

---

## Calendário (`/content/calendar`)

### Toggle Mensal/Semanal (desktop)

**Mensal:**
- Grid de 7 colunas (dom-sáb) × semanas do mês
- Cada dia: número + dots indicando itens de conteúdo
- Click em dot/item: abre detail panel
- Click em dia vazio: abre dialog de criação com data pré-preenchida

**Semanal:**
- 7 colunas (seg-dom) com lista de itens por dia
- Mais detalhes visíveis por item (título + status badge)

**Mobile:** apenas view mensal (scroll vertical).

---

## Critérios de Aceite

1. [ ] Lista/grid de conteúdo renderiza com dados mock
2. [ ] Toggle entre vista lista e grid funciona
3. [ ] Status badges com cores corretas
4. [ ] Filtro por status (pills) funciona
5. [ ] "Nova campanha" abre dialog de criação com todos os campos
6. [ ] Ao submeter, novo item aparece com status "rascunho"
7. [ ] Click em item abre preview/detail panel
8. [ ] "Aprovar" muda status e badge atualiza
9. [ ] "Solicitar Revisão" muda status
10. [ ] "Agendar" abre date picker → muda status para "agendado"
11. [ ] Timeline de status renderiza no detail panel
12. [ ] Swarm indicator mostra fases (research/draft/schedule)
13. [ ] Calendário mensal renderiza com items posicionados
14. [ ] Click em item no calendário abre detail
15. [ ] Click em dia vazio abre criação com data pré-preenchida
