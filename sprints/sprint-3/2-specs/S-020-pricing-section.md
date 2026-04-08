# S-020 — Seção de Pricing

**Discoveries:** D-031
**Passada:** 2 (Landing Pages)
**Prioridade:** 8
**Depende de:** S-017 (rota `/pricing` como redirect para âncora)

---

## Objetivo

Criar o componente de pricing reutilizável para ambos os apps, exibido como seção nas landing pages e linkado no registro para pré-seleção de plano. Os planos devem ser coerentes com o que já aparece em `SettingsPage` (KeepBiz) e `ConfigPage` (KeepSolo).

---

## Componente (`src/components/PricingSection.tsx`)

```tsx
interface PricingSectionProps {
  app: 'keepbiz' | 'keepsolo'
  selectedPlan?: string           // Plano pré-selecionado (highlight)
  onSelectPlan?: (planId: string) => void  // Callback para registro
  showBillingToggle?: boolean     // Default: true
}
```

---

## Planos KeepBiz

| | Starter | Growth | Enterprise |
|---|---|---|---|
| **Preço mensal** | R$ 297/mês | R$ 897/mês | Sob consulta |
| **Preço anual** | R$ 247/mês | R$ 747/mês | Sob consulta |
| **Badge** | — | "Mais Popular" | — |
| **Agentes** | Até 3 | Até 10 | Ilimitados |
| **Workflows** | 5 | 20 | Ilimitados |
| **Usuários** | 5 | 25 | Ilimitados |
| **Conectores** | 3 | Todos | Todos + custom |
| **Deploy** | Cloud | Cloud ou on-premise | On-premise dedicado |
| **Suporte** | Email | Prioritário | Dedicado + SLA |
| **Auditoria** | Básica | Completa | Completa + export |
| **RBAC** | — | ✓ | ✓ + custom roles |
| **CTA** | "Começar Grátis" | "Começar Agora" | "Falar com Vendas" |

### CTA Behavior

- Starter/Growth: `onClick` → `/register?plan={planId}`
- Enterprise: `onClick` → mock dialog ou `mailto:vendas@keepbiz.com`

---

## Planos KeepSolo

| | Free | Pro | Scale |
|---|---|---|---|
| **Preço mensal** | Grátis | R$ 97/mês | R$ 247/mês |
| **Preço anual** | Grátis | R$ 79/mês | R$ 197/mês |
| **Badge** | — | "Mais Popular" | — |
| **Agentes** | 1 | 3 | 10 |
| **Workflows** | 2 | 10 | Ilimitados |
| **Ferramentas** | 2 | Todas | Todas |
| **Leads/mês** | 50 | 500 | Ilimitados |
| **Conteúdo/mês** | 10 posts | 50 posts | Ilimitados |
| **Suporte** | Comunidade | Email | Prioritário |
| **CTA** | "Começar Grátis" | "Começar Agora" | "Começar Agora" |

### CTA Behavior

- Todos: `onClick` → `/register?plan={planId}`

---

## Layout Visual

### Cards de Plano

Cada plano é um card vertical com:
1. Nome do plano (heading)
2. Badge "Mais Popular" (se aplicável, destaque visual)
3. Preço (grande, destaque) com "/mês" menor
4. Toggle mensal/anual (shared entre os 3 cards)
5. Lista de features com ícones check (✓) ou dash (—)
6. Botão CTA (primary no "Mais Popular", outline nos demais)

### Toggle de Billing

- Switch/toggle "Mensal | Anual" no topo da seção
- Ao trocar, preços atualizam com animação suave (crossfade ou slide)
- Badge "Economize 17%" ou similar próximo à opção anual

### Responsividade

- Desktop: 3 colunas lado a lado, plano "Mais Popular" com escala ligeiramente maior ou borda destaque
- Tablet: 3 colunas comprimidas ou scroll horizontal
- Mobile: Stack vertical, plano "Mais Popular" primeiro

---

## Dados (`src/data/pricing.ts`)

```ts
export interface Plan {
  id: string
  name: string
  monthlyPrice: number | null    // null = "Sob consulta"
  yearlyPrice: number | null
  popular: boolean
  features: { label: string; included: boolean }[]
  cta: string
  ctaAction: 'register' | 'contact'
}

export const keepbizPlans: Plan[] = [...]
export const keepsoloPlans: Plan[] = [...]
```

---

## Critérios de Aceite

1. [ ] Componente `PricingSection` renderiza corretamente para `app="keepbiz"` e `app="keepsolo"`
2. [ ] 3 planos por app com preços, features e CTAs corretos
3. [ ] Toggle mensal/anual funciona e atualiza preços
4. [ ] Badge "Mais Popular" aparece no plano correto
5. [ ] CTA dos planos normais leva a `/register?plan={id}`
6. [ ] CTA Enterprise (KeepBiz) abre dialog de contato ou mailto
7. [ ] Pricing data em `src/data/pricing.ts` com tipagem correta
8. [ ] Responsivo: 3 colunas desktop, stack mobile
9. [ ] Seção integrada nas landing pages (S-018, S-019) via `#pricing`
10. [ ] Coerente com planos já exibidos em SettingsPage/ConfigPage
