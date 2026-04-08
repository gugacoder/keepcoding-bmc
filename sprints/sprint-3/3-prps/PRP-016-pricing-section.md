# PRP-016 — Seção de Pricing (Componente Compartilhado)

**Passada:** 2 — Landing Pages
**Specs:** S-020
**Discoveries:** D-031
**Prioridade:** 8

---

## Objetivo

Criar o componente de pricing reutilizável para ambos os apps, exibido como seção nas landing pages e usado no fluxo de registro para pré-seleção de plano. Os planos devem ser coerentes com o que já aparece em SettingsPage (KeepBiz) e ConfigPage (KeepSolo).

## Escopo

### Componente (`src/components/PricingSection.tsx`)
- Props: `app` (keepbiz/keepsolo), `selectedPlan?`, `onSelectPlan?`, `showBillingToggle?`
- Toggle mensal/anual com animação de preço
- Badge "Mais Popular" no plano destaque
- CTA por plano com navegação para `/register?plan={id}`

### Dados (`src/data/pricing.ts`)
- Interface `Plan` com `id`, `name`, `monthlyPrice`, `yearlyPrice`, `popular`, `features[]`, `cta`, `ctaAction`
- `keepbizPlans`: Starter (R$ 297), Growth (R$ 897, popular), Enterprise (sob consulta)
- `keepsoloPlans`: Free (grátis), Pro (R$ 97, popular), Scale (R$ 247)

### Planos KeepBiz
| | Starter | Growth | Enterprise |
|---|---|---|---|
| Mensal | R$ 297/mês | R$ 897/mês | Sob consulta |
| Anual | R$ 247/mês | R$ 747/mês | Sob consulta |
| Agentes | 3 | 10 | Ilimitados |
| Workflows | 5 | 20 | Ilimitados |
| CTA | Começar Grátis | Começar Agora | Falar com Vendas |

### Planos KeepSolo
| | Free | Pro | Scale |
|---|---|---|---|
| Mensal | Grátis | R$ 97/mês | R$ 247/mês |
| Anual | Grátis | R$ 79/mês | R$ 197/mês |
| Agentes | 1 | 3 | 10 |
| Workflows | 2 | 10 | Ilimitados |
| CTA | Começar Grátis | Começar Agora | Começar Agora |

### Layout
- Desktop: 3 colunas, plano popular com destaque visual
- Tablet: 3 colunas comprimidas ou scroll
- Mobile: stack vertical, plano popular primeiro

## Features

1. **F-016-A**: Dados de pricing — arquivo `src/data/pricing.ts` com tipos e arrays de planos para ambos os apps, coerente com planos existentes em Settings/Config
2. **F-016-B**: Componente PricingSection KeepBiz — 3 cards verticais com features, preços, badges e CTAs. Enterprise com ação de contato
3. **F-016-C**: Componente PricingSection KeepSolo — 3 cards verticais com features, preços, badges e CTAs. Todos com ação de registro
4. **F-016-D**: Toggle mensal/anual — switch no topo da seção, atualiza preços com animação suave, badge "Economize X%"
5. **F-016-E**: Seleção de plano interativa — prop `onSelectPlan` para uso no wizard de registro, highlight visual do plano selecionado

## Limites

- NÃO criar a landing page — o componente será integrado pelas landings (→ PRP-017, PRP-018)
- NÃO criar o fluxo de registro — o componente será integrado pelo wizard (→ PRP-021)
- CTA Enterprise é mock (dialog ou mailto)
- Dados de pricing são estáticos (não lê de API)

## Dependências

- **PRP-015** — rota `/pricing` como redirect para âncora deve existir
- **PRP-001** — scaffold base
