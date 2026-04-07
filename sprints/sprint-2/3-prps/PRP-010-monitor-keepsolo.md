# PRP-010 — Monitor (KeepSolo)

**Passada:** 3 — Zona 1: Monitor
**Specs:** S-010
**Discoveries:** D-015
**Prioridade:** 7

---

## Objetivo

Implementar o dashboard Monitor do KeepSolo — painel de funil pessoal com KPIs, funil visual, lista de leads com Sheet de detalhes e performance de conteúdo. Demonstra visibilidade do negócio para o solopreneur.

## Escopo

### Telas (`/monitor`)
- **KPIs**: cards com leads novos, conversões, receita, performance de conteúdo — variam por período
- **Funil visual**: 4 etapas (Visitante → Lead → Contato → Cliente) com contagem por etapa
- **Lista de leads**: nome, email, origem, status no funil, data
- **Performance de conteúdo**: posts recentes com métricas (views, clicks, engagement)
- **Seletor de período**: 7d / 30d / 90d — troca todos os números

### Dados Mock
- 8-10 leads com dados completos (nome, email, origem, status, data, notas)
- KPIs variam por período (3 conjuntos)
- 3-5 posts com métricas de performance

## Features

1. **F-010-A**: Cards de KPIs — 4 cards com ícone, valor, label, variação %, responsivos
2. **F-010-B**: Funil visual — 4 etapas em barras horizontais decrescentes, contagem por etapa, click filtra leads
3. **F-010-C**: Lista de leads — tabela/cards com nome, origem badge, status badge, data
4. **F-010-D**: Sheet de detalhes do lead — click abre Sheet com todas as info + notas mock
5. **F-010-E**: Performance de conteúdo — cards de posts recentes com views/clicks/engagement
6. **F-010-F**: Seletor de período — toggle 7d/30d/90d, troca KPIs e métricas
7. **F-010-G**: Filtro por etapa do funil — click em etapa filtra lista de leads por status

## Limites

- NÃO integrar com CRM real — tudo mock
- NÃO implementar edição de leads
- Funil é visual estático (não drag-and-drop)

## Dependências

- **PRP-001** — dados mock (leads)
- **PRP-003** — shell KeepSolo com rota `/monitor`
