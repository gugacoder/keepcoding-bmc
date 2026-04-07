# PRP-011 — Content Forge (KeepBiz)

**Passada:** 3 — Zona 2: Conteúdo
**Specs:** S-011
**Discoveries:** D-016
**Prioridade:** 6

---

## Objetivo

Implementar o Content Forge do KeepBiz — "The Megaphone" — com lista/grid de conteúdo, dialog de criação, preview panel com ações de aprovação/revisão/agendamento, swarm indicator, calendário e timeline de status.

## Escopo

### Telas (`/content`)
- **Lista/grid toggle**: cada item com título, tipo, plataforma, autor, status badge
- **Status badges**: Rascunho (gray), Em revisão (amber), Aprovado (blue), Agendado (purple), Publicado (green)
- **Filtro por status**: pills horizontais funcionais
- **"Nova campanha"**: Dialog com título, tipo (post/short/criativo/campanha), plataforma, autor, briefing, data alvo
- **Preview panel**: Sheet/panel com preview do conteúdo + ações

### Ações no Preview Panel
- "Aprovar" → muda status para aprovado
- "Solicitar revisão" → muda status para em revisão
- "Agendar" → date picker mock → muda status para agendado
- Timeline de status no panel (criado → em revisão → aprovado → publicado)

### Swarm Indicator
- Indicador visual de quem (agente) está fazendo o quê: research / draft / schedule
- Badge por fase com nome do agente

### Calendário (`/content/calendar`)
- View mensal e semanal (toggle)
- Click em item abre detail
- Click em dia vazio abre Dialog de criação com data pre-preenchida

## Features

1. **F-011-A**: Lista/grid de conteúdo — toggle view, cards com status badge, populada com dados mock
2. **F-011-B**: Filtro por status — pills horizontais, click filtra lista
3. **F-011-C**: Dialog "Nova campanha" — form com título, tipo, plataforma, autor, briefing, data → adiciona com status "rascunho"
4. **F-011-D**: Preview panel — Sheet com preview + botões de ação (Aprovar, Solicitar revisão, Agendar)
5. **F-011-E**: Timeline de status — lista visual de transições no preview panel
6. **F-011-F**: Swarm indicator — badges por fase (research/draft/schedule) com nome do agente
7. **F-011-G**: Calendário mensal — grid de dias com dots/items, click em item abre detail
8. **F-011-H**: Calendário semanal — view semanal no desktop, toggle mensal/semanal
9. **F-011-I**: Date picker para agendamento — ao clicar "Agendar" no preview, abre picker → muda status

## Limites

- NÃO integrar com APIs de redes sociais — agendamento é mock
- NÃO implementar editor de conteúdo rich-text
- Calendário é custom CSS grid — não depende de biblioteca pesada
- Swarm indicator é estático (dados mock, não atualiza em tempo real)

## Dependências

- **PRP-001** — dados mock (conteúdo)
- **PRP-002** — shell KeepBiz com rota `/content`
