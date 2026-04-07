# S-010 — Monitor (KeepSolo)

**Discoveries:** D-015
**Passada:** 3 (Zona 1 — Monitor)
**Prioridade:** 7
**Depende de:** S-001, S-003

---

## Objetivo

Implementar o dashboard de funil pessoal do KeepSolo: KPIs, lista de leads com Sheet de detalhes, funil visual com filtragem por etapa, e performance de conteúdo. O painel de controle do solopreneur.

---

## Layout (`/monitor`)

### Mobile (primário)

```
┌──────────────────────────────┐
│ Monitor          [7d|30d|90d]│
├──────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │Leads │ │Conv. │ │Receita│  │
│ │ +12  │ │  4   │ │R$2.3k│  │
│ └──────┘ └──────┘ └──────┘  │
├──────────────────────────────┤
│ Funil                        │
│ ████████████████ Visitante 45│
│ ██████████       Lead     12 │
│ █████            Contato   4 │
│ ██               Cliente   2 │
├──────────────────────────────┤
│ Leads Recentes               │
│ ┌────────────────────────┐   │
│ │ Maria O.  ● Lead  3/12│   │
│ │ João S.   ● Contato   │   │
│ │ Ana P.    ● Visitante │   │
│ └────────────────────────┘   │
├──────────────────────────────┤
│ Performance de Conteúdo      │
│ Post: Lançamento  240 views  │
│ Short: Behind...  180 views  │
└──────────────────────────────┘
```

### Desktop

Grid 2 colunas: KPIs + Funil na esquerda, Leads + Performance na direita.

---

## Componentes

### KPIs

3-4 cards compactos em row:
- **Leads novos**: número + delta vs período anterior
- **Conversões**: número
- **Receita**: valor formatado (R$)
- **Performance de conteúdo**: média de engagement

Dados mock variam por período:

| KPI | 7d | 30d | 90d |
|---|---|---|---|
| Leads novos | 3 (+1) | 12 (+3) | 38 (+8) |
| Conversões | 1 | 4 | 11 |
| Receita | R$ 800 | R$ 2.300 | R$ 7.500 |

### Funil Visual

Barras horizontais de largura proporcional à contagem:
- Visitante → Lead → Contato → Cliente
- Cada barra: label + contagem
- Cor: gradiente do mais claro (topo) ao mais saturado (fundo)
- **Click em etapa**: filtra a lista de leads abaixo para mostrar apenas leads naquela etapa
- Etapa ativa recebe destaque (borda ou background)

### Lista de Leads

Dados de `data/leads.ts`:
- Cada item: nome, badge de etapa do funil, data, origem
- Click abre Sheet (side panel) com detalhes do lead:
  - Nome, email, telefone
  - Origem (Instagram, WhatsApp, indicação, etc.)
  - Etapa do funil (badge)
  - Data de entrada
  - Notas (texto mock)
- Sheet fecha com X ou click fora

### Performance de Conteúdo

Lista simples dos posts recentes com métricas:
- Título do post
- Plataforma (ícone)
- Views, clicks, engagement rate
- Dados de `data/content.ts`

### Seletor de Período

- Toggle group: 7d, 30d, 90d
- Troca KPIs e contagens do funil
- Default: 7d

---

## Critérios de Aceite

1. [ ] KPIs renderizam com números e deltas
2. [ ] Seletor de período (7d/30d/90d) troca KPIs e contagens
3. [ ] Funil visual renderiza com barras proporcionais e contagens
4. [ ] Click em etapa do funil filtra lista de leads
5. [ ] Lista de leads renderiza com nome, badge de etapa, data
6. [ ] Click em lead abre Sheet com detalhes completos
7. [ ] Sheet fecha com X ou click fora
8. [ ] Performance de conteúdo renderiza posts com métricas
9. [ ] Layout responsivo: empilhado (mobile) → 2 colunas (desktop)
10. [ ] Dados mock são realistas e coerentes entre si
