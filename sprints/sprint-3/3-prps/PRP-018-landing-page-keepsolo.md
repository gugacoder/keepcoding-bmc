# PRP-018 — Landing Page KeepSolo

**Passada:** 2 — Landing Pages
**Specs:** S-019
**Discoveries:** D-026, D-032, D-033, D-034
**Prioridade:** 10

---

## Objetivo

Criar a landing page pública do KeepSolo — a porta de entrada para solopreneurs (coaches, consultores, freelancers). A página deve convencer profissionais autônomos de que KeepSolo dá a eles uma equipe virtual de agentes que opera enquanto eles dormem. Tom pessoal, cores quentes, copy direto e empoderador. Animações de scroll e demo animado do Monitor.

## Escopo

### Telas / Componentes
- **LandingPage** (`src/pages/LandingPage.tsx`): single-page com scroll, substituindo o placeholder de PRP-015
- **Navbar fixa**: logo, links de âncora, botões Entrar/Começar Agora
- **MonitorDemo** (`src/components/MonitorDemo.tsx`): mock animado do Monitor com lead chegando no funil (card slide-in + contagem incrementando)

### Seções da Landing
1. **Hero** (`#hero`): headline + subheadline + 2 CTAs + imagem DALL-E (fallback: gradient quente + ícones) + demo animado Monitor
2. **Como Funciona** (`#how-it-works`): 3 passos com ícones Phosphor e animação scroll-triggered
3. **Benefícios** (`#benefits`): grid 2x2 desktop / stack mobile com 4 cards
4. **Social Proof** (`#testimonials`): 3 personas fictícias de solopreneurs com depoimentos
5. **Pricing** (`#pricing`): renderiza `<PricingSection app="keepsolo" />` (PRP-016)
6. **CTA Final**: headline + botão registro
7. **Footer**: logo, tagline, links mock, copyright

### Copy (D-032)
- Headline: "Você não precisa fazer tudo sozinho."
- Subheadline: "KeepSolo te dá uma equipe de agentes de IA que cuida dos seus clientes, conteúdo e operações — enquanto você foca no que importa."
- CTA primário: "Começar Agora" → `/register`
- CTA secundário: "Ver Demo" → scroll para `#how-it-works`

### Animações
- Scroll-triggered via `IntersectionObserver` (fade-in + slide-up, threshold 0.1)
- Hero demo: CSS `@keyframes` para slide-in de card de lead no funil mock
- Hover: escala sutil (1.02) + transição de cor nos botões
- Sem bibliotecas externas de animação

### Responsividade
- Desktop (≥1024px): hero 2 colunas, benefícios grid 2x2, pricing 3 colunas
- Tablet (768–1023px): hero stack, benefícios 2 colunas
- Mobile (<768px): tudo stack, navbar hamburguer, CTAs full-width

## Features

1. **F-018-A**: Navbar fixa — logo KeepSolo, links de âncora com scroll suave, botões Entrar/Começar Agora, hamburguer mobile
2. **F-018-B**: Seção Hero — headline pessoal, subheadline, 2 CTAs, imagem hero (DALL-E ou fallback gradient quente), layout 2 colunas desktop
3. **F-018-C**: MonitorDemo — componente isolado com animação CSS de lead chegando no funil (card slide-in + contagem incrementando)
4. **F-018-D**: Seção Como Funciona — 3 passos com ícones Phosphor (ChatCircle, Lightning, Eye), animação scroll-triggered
5. **F-018-E**: Seção Benefícios — 4 cards em grid 2x2 com títulos e descrições pessoais/empoderadoras
6. **F-018-F**: Seção Social Proof — 3 personas fictícias (coach, consultor, freelancer) com depoimentos e cargo
7. **F-018-G**: Seção Pricing — integração do componente `<PricingSection app="keepsolo" />` via âncora `#pricing`
8. **F-018-H**: CTA Final + Footer — headline final com CTA registro, footer com logo/links/copyright
9. **F-018-I**: Animações scroll-triggered — IntersectionObserver para fade-in + slide-up em todas as seções

## Limites

- NÃO implementar o componente PricingSection (→ PRP-016, já existente)
- NÃO implementar login/registro funcional (→ PRP-020, PRP-021)
- NÃO gerar imagens DALL-E (→ PRP-019) — usar fallback gradient se imagem não existir
- Depoimentos e personas são fictícios

## Dependências

- **PRP-015** — rota `/landing` e RouteGuard devem existir
- **PRP-016** — componente PricingSection deve existir para integração na seção `#pricing`
