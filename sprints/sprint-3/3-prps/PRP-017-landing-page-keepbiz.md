# PRP-017 — Landing Page KeepBiz

**Passada:** 2 — Landing Pages
**Specs:** S-018
**Discoveries:** D-025, D-032, D-033, D-034
**Prioridade:** 10

---

## Objetivo

Criar a landing page pública do KeepBiz — a porta de entrada do produto para PMEs. A página deve convencer gestores de PMEs (5–200 pessoas) de que KeepBiz é a solução para automatizar processos internos com agentes de IA. Tom corporativo, cores frias, copy que fala diretamente com as dores do gestor. Animações de scroll e demo animado do OrchestratorBar.

## Escopo

### Telas / Componentes
- **LandingPage** (`src/pages/LandingPage.tsx`): single-page com scroll, substituindo o placeholder de PRP-015
- **Navbar fixa**: logo, links de âncora (Como Funciona, Benefícios, Depoimentos, Pricing), botões Entrar/Começar Grátis
- **OrchestratorBarDemo** (`src/components/OrchestratorBarDemo.tsx`): mock animado da OrchestratorBar com status transitando green→yellow→green

### Seções da Landing
1. **Hero** (`#hero`): headline + subheadline + 2 CTAs + imagem DALL-E (fallback: gradient + ícones) + demo animado OrchestratorBar
2. **Como Funciona** (`#how-it-works`): 3 passos com ícones Phosphor e animação scroll-triggered
3. **Benefícios** (`#benefits`): grid 2x2 desktop / stack mobile com 4 cards
4. **Social Proof** (`#testimonials`): logos (Processa Sistemas, Cia Cuidadores) + 3 depoimentos fictícios
5. **Pricing** (`#pricing`): renderiza `<PricingSection app="keepbiz" />` (PRP-016)
6. **CTA Final**: headline + botão registro
7. **Footer**: logo, tagline, links mock, copyright

### Copy (D-032)
- Headline: "Sua equipe de agentes de IA. Pronta para trabalhar."
- Subheadline: "KeepBiz mapeia os processos da sua empresa, cria aplicações sob medida e ativa agentes que operam 24/7 — com controle total nas suas mãos."
- CTA primário: "Começar Grátis" → `/register`
- CTA secundário: "Agendar Demo" → link mock

### Animações
- Scroll-triggered via `IntersectionObserver` (fade-in + slide-up, threshold 0.1)
- Hero demo: CSS `@keyframes` para transição de cores do OrchestratorBar mock
- Hover: escala sutil (1.02) + transição de cor nos botões
- Sem bibliotecas externas de animação

### Responsividade
- Desktop (≥1024px): hero 2 colunas, benefícios grid 2x2, pricing 3 colunas
- Tablet (768–1023px): hero stack, benefícios 2 colunas
- Mobile (<768px): tudo stack, navbar hamburguer, CTAs full-width

## Features

1. **F-017-A**: Navbar fixa — logo, links de âncora com scroll suave, botões Entrar/Começar Grátis, hamburguer mobile
2. **F-017-B**: Seção Hero — headline, subheadline, 2 CTAs, imagem hero (DALL-E ou fallback gradient), layout 2 colunas desktop
3. **F-017-C**: OrchestratorBarDemo — componente isolado com animação CSS de status transitando green→yellow→green em loop
4. **F-017-D**: Seção Como Funciona — 3 passos com ícones Phosphor (ChatText, Robot, ShieldCheck), animação scroll-triggered
5. **F-017-E**: Seção Benefícios — 4 cards em grid 2x2 com títulos e descrições corporativos
6. **F-017-F**: Seção Social Proof — logos de empresas (texto estilizado ou SVG) + 3 depoimentos fictícios com nome/cargo
7. **F-017-G**: Seção Pricing — integração do componente `<PricingSection app="keepbiz" />` via âncora `#pricing`
8. **F-017-H**: CTA Final + Footer — headline final com CTA registro, footer com logo/links/copyright
9. **F-017-I**: Animações scroll-triggered — IntersectionObserver para fade-in + slide-up em todas as seções

## Limites

- NÃO implementar o componente PricingSection (→ PRP-016, já existente)
- NÃO implementar login/registro funcional (→ PRP-020, PRP-021)
- NÃO gerar imagens DALL-E (→ PRP-019) — usar fallback gradient se imagem não existir
- Navbar hamburguer é visual — links funcionam via scroll de âncora
- Depoimentos e logos são fictícios

## Dependências

- **PRP-015** — rota `/landing` e RouteGuard devem existir
- **PRP-016** — componente PricingSection deve existir para integração na seção `#pricing`
