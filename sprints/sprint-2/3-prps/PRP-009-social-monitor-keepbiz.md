# PRP-009 — Social Monitor (KeepBiz)

**Passada:** 3 — Zona 1: Monitor
**Specs:** S-009
**Discoveries:** D-014
**Prioridade:** 7

---

## Objetivo

Implementar o dashboard Social Monitor do KeepBiz — "The Mirror" — com feed de menções, score de reputação, alertas, gráfico de trends e filtros funcionais. Dashboard passivo de inteligência que demonstra monitoramento de marca.

## Escopo

### Telas (`/monitor`)
- **Score de reputação**: número grande (ex: 8.4/10) com trend indicator (seta up/down + %)
- **Gráfico de trends**: volume de menções ao longo do tempo (chart simples — barras ou linha)
- **Alertas**: lista de notificações relevantes (menção negativa, pico), clicáveis
- **Feed de menções**: lista cronológica com texto, fonte, sentimento badge (positivo/neutro/negativo), data
- **Seletor de período**: 7d / 30d / 90d — troca todos os números/dados
- **Filtro por fonte**: Twitter/X, Google Reviews, Instagram, Facebook, Fórum — funcional

### Dados Mock
- 5-8 menções com sentimento variado e fontes diversas
- Score e métricas variam por período selecionado (3 conjuntos de dados)
- 3-4 alertas mock

## Features

1. **F-009-A**: Score de reputação — card com número, trend indicator, variação por período
2. **F-009-B**: Gráfico de trends — chart de volume de menções (biblioteca leve ou SVG inline)
3. **F-009-C**: Lista de alertas — cards clicáveis com ícone, título, descrição, timestamp
4. **F-009-D**: Feed de menções — lista com texto truncado, fonte badge, sentimento badge, data
5. **F-009-E**: Seletor de período — toggle 7d/30d/90d, troca dados em todo o dashboard
6. **F-009-F**: Filtro por fonte — pills horizontais, filtra feed de menções
7. **F-009-G**: Detail de menção — click abre Sheet com texto completo, fonte, sentimento, data

## Limites

- NÃO buscar dados reais de redes sociais — tudo mock
- NÃO implementar notificações push ou real-time
- Gráfico pode ser SVG simples ou recharts — não precisa ser interativo

## Dependências

- **PRP-001** — dados mock (menções)
- **PRP-002** — shell KeepBiz com rota `/monitor`
