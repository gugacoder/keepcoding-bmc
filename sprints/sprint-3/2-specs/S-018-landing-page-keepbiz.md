# S-018 — Landing Page KeepBiz

**Discoveries:** D-025, D-032 (copy KeepBiz), D-033 (social proof KeepBiz), D-034 (demo animado KeepBiz)
**Passada:** 2 (Landing Pages)
**Prioridade:** 10
**Depende de:** S-017 (route guard — rota `/landing` deve existir)

---

## Objetivo

Criar a landing page pública do KeepBiz — a porta de entrada do produto para PMEs. A página deve convencer gestores de PMEs (5–200 pessoas) de que KeepBiz é a solução para automatizar processos internos com agentes de IA. Tom corporativo, cores frias, copy que fala diretamente com as dores do gestor.

---

## Estrutura da Página (`src/pages/LandingPage.tsx`)

A landing é uma single-page com scroll, dividida em seções com IDs para navegação por âncora.

### Navbar Fixa

- Logo KeepBiz (texto ou SVG)
- Links: Como Funciona, Benefícios, Depoimentos, Pricing
- Botões: "Entrar" (link para `/login`), "Começar Grátis" (link para `/register`)
- Responsiva: hamburguer no mobile

### Seção 1 — Hero (`#hero`)

- **Headline:** "Sua equipe de agentes de IA. Pronta para trabalhar."
- **Subheadline:** "KeepBiz mapeia os processos da sua empresa, cria aplicações sob medida e ativa agentes que operam 24/7 — com controle total nas suas mãos."
- **CTA primário:** "Começar Grátis" → `/register`
- **CTA secundário:** "Agendar Demo" → link mock (pode ser `#` ou mailto)
- **Visual:** Imagem hero gerada via DALL-E (S-023) — ambiente corporativo moderno com representação visual de agentes digitais. Fallback: gradient abstrato com ícones Phosphor animados
- **Demo animado (D-034):** Abaixo ou ao lado do hero, um mockup do OrchestratorBar com animação CSS — status transitando de verde → amarelo → verde em loop. Pode ser um componente isolado `<OrchestratorBarDemo />` que replica visualmente a barra sem lógica real

### Seção 2 — Como Funciona (`#how-it-works`)

3 passos com ícones Phosphor e animação de entrada (scroll-triggered via `IntersectionObserver`):

| Step | Ícone | Título | Descrição |
|---|---|---|---|
| 1 | `ChatText` | "Descreva o processo" | "Conte como sua equipe trabalha. O KeepBiz entende o fluxo e mapeia as etapas." |
| 2 | `Robot` | "Agentes são ativados" | "Agentes especializados são treinados no contexto do seu negócio e começam a operar." |
| 3 | `ShieldCheck` | "Você mantém o controle" | "Aprovação humana para ações críticas. Auditoria completa. Nada acontece sem sua permissão." |

### Seção 3 — Benefícios (`#benefits`)

Grid 2x2 (desktop) / stack (mobile):

| Benefício | Descrição |
|---|---|
| "Equipe que não tira férias" | "Agentes operam 24/7 sem parar. Processos que levavam horas agora levam minutos." |
| "Deploy on-premise" | "Seus dados ficam na sua infraestrutura. Controle total sobre onde e como a IA opera." |
| "RBAC e auditoria" | "Defina quem pode o quê. Cada ação do agente é registrada e rastreável." |
| "Integra com o que você já usa" | "Google Workspace, WhatsApp, ERP, CRM — conecte as ferramentas da sua equipe em minutos." |

### Seção 4 — Social Proof / Depoimentos (`#testimonials`)

**Logos:** Processa Sistemas, Cia Cuidadores (logos podem ser texto estilizado ou SVG simples)

**Depoimentos fictícios (2-3):**

1. **Carlos Mendes** — CTO, Processa Sistemas
   > "Implementamos o KeepBiz no financeiro em uma semana. O Invoice Hunter já conciliou mais de 2.000 transações sem erro."

2. **Ana Ribeiro** — Diretora de Operações, Cia Cuidadores
   > "Nossos agentes de agendamento reduziram em 60% o tempo que a equipe gastava com marcações manuais."

3. **Ricardo Souza** — CEO, Processa Sistemas
   > "Pela primeira vez, tenho visibilidade real do que acontece em cada departamento — e os agentes fazem o trabalho pesado."

### Seção 5 — Pricing (`#pricing`)

Renderiza o componente `<PricingSection app="keepbiz" />` (spec S-020).

### Seção 6 — CTA Final

- Headline: "Pronto para automatizar sua empresa?"
- Subheadline: "Comece gratuitamente. Sem cartão de crédito."
- Botão: "Começar Grátis" → `/register`

### Footer

- Logo + tagline
- Links: Sobre, Contato, Termos, Privacidade (todos mock `#`)
- Copyright: "© 2026 KeepBiz. Todos os direitos reservados."

---

## Animações

- **Scroll-triggered:** Usar `IntersectionObserver` para animar entrada de seções (fade-in + slide-up). Threshold: 0.1.
- **Hero demo:** CSS animation com `@keyframes` para transição de cores do OrchestratorBar mock.
- **Hover:** Botões com escala sutil (1.02) e transição de cor.
- **Performance:** Não usar bibliotecas externas de animação — CSS + IntersectionObserver são suficientes.

---

## Responsividade

- **Desktop (≥1024px):** Hero com layout 2 colunas (texto + visual). Benefícios em grid 2x2. Pricing em 3 colunas.
- **Tablet (768–1023px):** Hero em stack. Benefícios em 2 colunas. Pricing em stack.
- **Mobile (<768px):** Tudo em stack. Navbar com hamburguer. CTAs full-width. Fonte do hero reduzida.

---

## Critérios de Aceite

1. [ ] Landing renderiza em `/landing` sem necessidade de login
2. [ ] Navbar com links de âncora funcionais (scroll suave para seções)
3. [ ] Hero com headline, subheadline, 2 CTAs e visual (imagem ou fallback)
4. [ ] Seção "Como Funciona" com 3 passos e ícones Phosphor
5. [ ] Seção de benefícios com 4 cards
6. [ ] Seção de depoimentos com logos e quotes
7. [ ] Seção de pricing integrada (componente de S-020)
8. [ ] CTA final com link para registro
9. [ ] Footer com links mock
10. [ ] Animações de scroll-triggered funcionando
11. [ ] Demo animado do OrchestratorBar no hero
12. [ ] Responsivo: mobile, tablet e desktop
13. [ ] Tom corporativo, cores frias, design tokens do app
14. [ ] "Começar Grátis" leva a `/register`, "Entrar" leva a `/login`
