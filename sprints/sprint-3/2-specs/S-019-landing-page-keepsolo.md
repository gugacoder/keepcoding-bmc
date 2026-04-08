# S-019 — Landing Page KeepSolo

**Discoveries:** D-026, D-032 (copy KeepSolo), D-033 (social proof KeepSolo), D-034 (demo animado KeepSolo)
**Passada:** 2 (Landing Pages)
**Prioridade:** 10
**Depende de:** S-017 (route guard — rota `/landing` deve existir)

---

## Objetivo

Criar a landing page pública do KeepSolo — a porta de entrada para solopreneurs (coaches, consultores, freelancers). A página deve convencer profissionais autônomos de que KeepSolo dá a eles uma equipe virtual de agentes que opera enquanto eles dormem. Tom pessoal, cores quentes, copy direto e empoderador.

---

## Estrutura da Página (`src/pages/LandingPage.tsx`)

Single-page com scroll, seções com IDs para âncora.

### Navbar Fixa

- Logo KeepSolo (texto ou SVG)
- Links: Como Funciona, Benefícios, Depoimentos, Pricing
- Botões: "Entrar" (→ `/login`), "Começar Agora" (→ `/register`)
- Hamburguer no mobile

### Seção 1 — Hero (`#hero`)

- **Headline:** "Você não precisa fazer tudo sozinho."
- **Subheadline:** "KeepSolo te dá uma equipe de agentes de IA que cuida dos seus clientes, conteúdo e operações — enquanto você foca no que importa."
- **CTA primário:** "Começar Agora" → `/register`
- **CTA secundário:** "Ver Demo" → scroll para seção de demo ou `#how-it-works`
- **Visual:** Imagem hero gerada via DALL-E (S-023) — solopreneur confiante com representação visual de agentes digitais ao redor. Fallback: gradient quente com ícones Phosphor animados
- **Demo animado (D-034):** Mockup do Monitor KeepSolo com animação CSS — um lead chegando no funil (card slide-in + contagem incrementando). Componente `<MonitorDemo />` que replica visualmente o funil sem lógica real

### Seção 2 — Como Funciona (`#how-it-works`)

3 passos com ícones Phosphor e animação scroll-triggered:

| Step | Ícone | Título | Descrição |
|---|---|---|---|
| 1 | `ChatCircle` | "Conte o que você faz" | "Descreva seus processos do dia a dia. Sem jargão técnico — fale como se estivesse explicando a um assistente." |
| 2 | `Lightning` | "Agentes começam a trabalhar" | "Em minutos, seus agentes estão operando: respondendo leads, agendando, cobrando, criando conteúdo." |
| 3 | `Eye` | "Acompanhe os resultados" | "Veja tudo no seu Monitor: leads, conversões, receita. Seus agentes reportam — você decide." |

### Seção 3 — Benefícios (`#benefits`)

Grid 2x2 (desktop) / stack (mobile):

| Benefício | Descrição |
|---|---|
| "Sua equipe virtual" | "Agentes que fazem follow-up, agendam reuniões e criam conteúdo — 24 horas por dia." |
| "Setup em minutos" | "Sem código, sem configuração complexa. Descreva o que precisa e os agentes se organizam." |
| "Resultados visíveis" | "Monitor com leads, conversões e receita. Saiba exatamente o que seus agentes fizeram." |
| "Suas ferramentas" | "WhatsApp, Google Calendar, Instagram — os agentes usam o que você já usa." |

### Seção 4 — Social Proof / Depoimentos (`#testimonials`)

**Personas fictícias de solopreneurs:**

1. **Marina Costa** — Coach de Carreira
   > "Eu passava 3 horas por dia só respondendo mensagens de leads. Agora meu agente faz isso e eu ganhei minha manhã de volta."

2. **Felipe Andrade** — Consultor Financeiro
   > "Meus clientes inadimplentes recebem lembretes automáticos. A taxa de pagamento em dia subiu 40% em dois meses."

3. **Juliana Mendes** — Freelancer de Design
   > "O agente agenda minhas reuniões, manda propostas e até faz follow-up. É como ter uma assistente que nunca esquece nada."

### Seção 5 — Pricing (`#pricing`)

Renderiza o componente `<PricingSection app="keepsolo" />` (spec S-020).

### Seção 6 — CTA Final

- Headline: "Comece a delegar agora."
- Subheadline: "Crie sua conta em 30 segundos. Sem cartão de crédito."
- Botão: "Começar Agora" → `/register`

### Footer

- Logo + tagline
- Links: Sobre, Contato, Termos, Privacidade (todos mock `#`)
- Copyright: "© 2026 KeepSolo. Todos os direitos reservados."

---

## Animações

- **Scroll-triggered:** `IntersectionObserver` para fade-in + slide-up das seções. Threshold: 0.1.
- **Hero demo:** CSS animation com `@keyframes` para slide-in de card de lead no funil mock.
- **Hover:** Botões com escala sutil (1.02) e transição de cor.
- **Performance:** CSS + IntersectionObserver apenas — sem bibliotecas de animação externas.

---

## Responsividade

- **Desktop (≥1024px):** Hero 2 colunas. Benefícios grid 2x2. Pricing 3 colunas.
- **Tablet (768–1023px):** Hero em stack. Benefícios 2 colunas.
- **Mobile (<768px):** Tudo em stack. Navbar hamburguer. CTAs full-width. Fonte reduzida.

---

## Critérios de Aceite

1. [ ] Landing renderiza em `/landing` sem necessidade de login
2. [ ] Navbar com links de âncora e scroll suave
3. [ ] Hero com headline, subheadline, 2 CTAs e visual (imagem ou fallback)
4. [ ] Seção "Como Funciona" com 3 passos e ícones Phosphor
5. [ ] Seção de benefícios com 4 cards
6. [ ] Seção de depoimentos com personas e quotes
7. [ ] Seção de pricing integrada (componente de S-020)
8. [ ] CTA final com link para registro
9. [ ] Footer com links mock
10. [ ] Animações scroll-triggered funcionando
11. [ ] Demo animado do Monitor no hero
12. [ ] Responsivo: mobile, tablet e desktop
13. [ ] Tom pessoal, cores quentes, design tokens do app
14. [ ] "Começar Agora" leva a `/register`, "Entrar" leva a `/login`
