# S-009 — Social Monitor (KeepBiz)

**Discoveries:** D-014
**Passada:** 3 (Zona 1 — Monitor)
**Prioridade:** 7
**Depende de:** S-001, S-002

---

## Objetivo

Implementar o Social Monitor do KeepBiz — dashboard passivo de inteligência com feed de menções, score de reputação, alertas, gráfico de trends e filtros por fonte. Demonstra valor de monitoramento de marca para PMEs.

---

## Layout (`/monitor`)

### Desktop

```
┌─────────────────────────────────────────────────┐
│ Social Monitor            Período: [7d|30d|90d] │
├──────────────────────┬──────────────────────────┤
│ Score de Reputação   │ Gráfico de Trends        │
│ ┌────────────────┐   │ ┌──────────────────────┐ │
│ │    8.4 / 10    │   │ │ ▄▆█▇▅▆▇█▆▄▅▆       │ │
│ │  ▲ +0.3 (7d)   │   │ │ (volume de menções)  │ │
│ └────────────────┘   │ └──────────────────────┘ │
├──────────────────────┴──────────────────────────┤
│ Alertas (2)                                     │
│ ⚠ Menção negativa: "Demora no suporte..."       │
│ 🔔 Pico de menções no Google Reviews (+40%)     │
├─────────────────────────────────────────────────┤
│ Feed de Menções       Filtro: [Todas] [Twitter]  │
│                       [G.Reviews] [Instagram]    │
│ ┌───────────────────────────────────────────┐   │
│ │ @joaosilva no Twitter  ● Positivo  12/03  │   │
│ │ "Excelente atendimento da equipe..."       │   │
│ ├───────────────────────────────────────────┤   │
│ │ Ana M. no Google Reviews ● Neutro  11/03  │   │
│ │ "Bom produto, entrega poderia ser..."      │   │
│ └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Mobile

Layout empilhado: Score → Alertas → Gráfico → Feed. Filtros em pills scrolláveis horizontalmente.

---

## Componentes

### Score de Reputação

- Número grande centralizado: `8.4 / 10`
- Trend indicator: seta para cima/baixo + delta (ex: "+0.3")
- Cor do delta: green se positivo, red se negativo
- Muda conforme período selecionado:
  - 7d: 8.4 (+0.3)
  - 30d: 8.1 (+0.1)
  - 90d: 7.9 (-0.2)

### Gráfico de Trends

- Gráfico de barras ou linha simples mostrando volume de menções ao longo do tempo
- Implementar com CSS puro (barras com divs) ou biblioteca leve (recharts)
- Eixo X: datas, Eixo Y: contagem de menções
- Dados mock: array de 7/30/90 pontos conforme período

### Seletor de Período

- Toggle group com 3 opções: 7d, 30d, 90d
- Ao trocar: score, trend, gráfico e contagem de menções atualizam
- Default: 7d

### Alertas

- Lista de 2-3 alertas mock
- Cada alerta: ícone (Warning/Bell), texto, data
- Click abre detalhes expandidos (accordion ou dialog simples)
- Badge de contagem no header "Alertas (2)"

### Feed de Menções

- Lista cronológica de menções (dados de `data/mentions.ts`)
- Cada menção:
  - Autor + fonte (com ícone da plataforma)
  - Sentimento: badge colorido (Positivo=green, Neutro=gray, Negativo=red)
  - Data formatada
  - Texto da menção (truncado, expandível no click)

### Filtro por Fonte

- Pills: Todas, Twitter/X, Google Reviews, Instagram, Facebook, Fórum
- Click filtra o feed — mostra apenas menções da fonte selecionada
- "Todas" é default
- Contagem por fonte exibida no pill (ex: "Twitter (3)")

---

## Dados Mock por Período

Para cada período, variar levemente os números para parecer realista:

| Período | Score | Delta | Menções | Alertas |
|---|---|---|---|---|
| 7d | 8.4 | +0.3 | 12 | 2 |
| 30d | 8.1 | +0.1 | 47 | 5 |
| 90d | 7.9 | -0.2 | 134 | 12 |

---

## Critérios de Aceite

1. [ ] Score de reputação renderiza com número e trend
2. [ ] Seletor de período (7d/30d/90d) troca todos os números
3. [ ] Gráfico de trends renderiza com dados mock
4. [ ] Alertas listados com ícone, texto e data
5. [ ] Click em alerta mostra detalhes
6. [ ] Feed de menções renderiza cronologicamente
7. [ ] Cada menção mostra autor, fonte, sentimento, data e texto
8. [ ] Filtro por fonte funciona — filtra o feed
9. [ ] Sentimentos com badges coloridos (green/gray/red)
10. [ ] Layout responsivo: dashboard → empilhado no mobile
