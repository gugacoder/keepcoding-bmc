# Brainstorming — Sprint 3 / Wave 4
## Landing Pages + Auth — KeepBiz & KeepSolo

---

## Contexto

O TASK.md desta wave define a construção de:

1. **Landing Pages** para os dois apps já implementados (`mocks/keep-biz/` e `mocks/keep-solo/`), com copy que converte e recursos visuais gerados via OpenAI (DALL-E imagens, eventualmente vídeos/animações).
2. **Mockup de Auth** completo — login, auto-registro com seleção de plano — suportando três métodos: usuário/senha, OTP via WhatsApp, OTP via email.

**Objetivo das landing pages:** convencer clientes piloto (Processa Sistemas, Cia Cuidadores) e potenciais investidores de que KeepBiz e KeepSolo são produtos reais e desejáveis. Copy focado em valor, não em features.

**Objetivo do auth:** demonstrar o fluxo completo de onboarding — da landing → plano → conta → app. No mock, qualquer combinação de usuário e senha é aceita (sem validação real).

---

## Funcionalidades Mapeadas

### O que já existe (sprint-2, todas passing)

Os dois apps estão completamente implementados com todas as suas zonas funcionais:

- **KeepBiz** (`mocks/keep-biz/`): shell + Orchestrator Bar, Social Monitor, Content Forge, Agent Core (workflows, agentes, chat, conectores), Settings (RBAC, audit, plano). OpenAI DALL-E integrado para assets mock.
- **KeepSolo** (`mocks/keep-solo/`): shell + bottom nav, Monitor (funil + leads), Create (conteúdo + calendário), Agents (workflows, chat, tools), Config. OpenAI DALL-E integrado.

**O que NÃO existe** (a ser criado no sprint-3):
- Nenhuma landing page pública para os dois apps
- Nenhuma rota `/login`, `/register`, `/pricing` em nenhum dos apps
- Nenhum fluxo de auth — os apps abrem diretamente no dashboard

### Contexto de produto (dos sources)

- **KeepBiz**: suite para PMEs (5–200 pessoas), deploy on-premise, tom corporativo, cores frias. Proposta: mapear workflow → construir app-wrapper → agentes observam → agentes assumem. Diferencial: controle total, auditoria, RBAC.
- **KeepSolo**: app para solopreneurs (1 pessoa), SaaS público, tom pessoal, cores quentes. Proposta: o solopreneur ganha uma equipe de agentes que operam suas ferramentas enquanto ele dorme. Diferencial: simplicidade, velocidade de setup, resultado visível em minutos.

---

## Lacunas e Oportunidades

### Lacuna 1 — Ausência total de landing pages
Os apps são acessíveis diretamente no dashboard sem qualquer "porta de entrada". Para pitch e conversão, é essencial ter uma landing pública antes do auth.

### Lacuna 2 — Sem fluxo de auth
O TASK.md exige login + registro com seleção de plano e três métodos de autenticação. Nenhum desses fluxos existe. Sem auth, o demo não demonstra o funil completo de aquisição.

### Lacuna 3 — Copy de conversão indefinido
O TASK.md menciona "copy que converte" mas não especifica mensagens. É necessário definir headlines, subheadlines e CTAs para cada app, alinhados ao posicionamento (corporativo vs. pessoal).

### Lacuna 4 — Assets visuais para hero sections
O hero das landing pages precisa de imagens de alto impacto. Os assets DALL-E existentes nos apps são para contexto interno (avatares, thumbnails). Para a landing, são necessários criativos específicos que comuniquem a proposta de valor visualmente.

### Lacuna 5 — Seleção de plano no fluxo de registro
O TASK.md pede registro com seleção de plano. Os planos precisam ser definidos (nome, preço, features) de forma coerente com o que já aparece em `SettingsPage` (KeepBiz) e `ConfigPage` (KeepSolo).

### Lacuna 6 — OTP mock requer UI de step
Suporte a OTP via WhatsApp e email no mock requer um step adicional de "inserir código". No mock, qualquer código de 6 dígitos deve ser aceito — mas a UI precisa existir.

### Lacuna 7 — Rotas públicas vs. rotas protegidas
Atualmente os apps não têm distinção entre rotas públicas (landing, login, register) e protegidas (dashboard). O sprint-3 precisa introduzir essa distinção com um guard de rota simples (localStorage flag `isLoggedIn`).

### Oportunidade 1 — Hero animado com demonstração do produto
Uma seção hero com screenshot animado ou vídeo curto do próprio app em ação é muito mais convincente do que texto estático. A landing pode mostrar o OrchestratorBar ou o deploy pipeline em loop — a cena mais marcante do produto.

### Oportunidade 2 — Social proof com clientes piloto
Usar logos e depoimentos fictícios de Processa Sistemas e Cia Cuidadores na landing cria imediata credibilidade para o pitch com esses mesmos clientes.

### Oportunidade 3 — Pricing diferenciado como narrativa
A página de pricing pode contar a história do produto: do "explore" (free/trial) ao "scale" (enterprise). O plano escolhido aparece pré-selecionado na tela de registro, criando fluidez na jornada.

### Oportunidade 4 — Continuidade visual entre landing e app
A landing deve usar os mesmos tokens de design do app (cores, tipografia, componentes shadcn). Isso passa a impressão de produto coeso e acelera o desenvolvimento.

---

## Priorização

Scoring: impacto no objetivo (pitch/conversão) × dependência técnica × esforço relativo.

| # | Discovery | Score | Justificativa |
|---|-----------|-------|---------------|
| D-025 | Landing page KeepBiz (hero + seções + CTA) | 10 | Porta de entrada do produto; essencial para pitch e conversão |
| D-026 | Landing page KeepSolo (hero + seções + CTA) | 10 | Idem para o app voltado a solopreneurs |
| D-027 | OpenAI DALL-E — assets específicos para heroes | 9 | Imagens de alto impacto elevam credibilidade das landings |
| D-028 | Auth — Login (email/senha + OTP WhatsApp + OTP email) | 9 | Pré-requisito para o registro; ponto de re-entrada ao app |
| D-029 | Auth — Registro + seleção de plano | 9 | Fluxo de onboarding completo; demonstra funil de aquisição |
| D-030 | Route guard simples (público vs. protegido) | 8 | Necessário para que landing/login/register sejam rotas separadas do dashboard |
| D-031 | Página de Pricing em ambas as landings | 8 | Ancora a seleção de plano no registro; conta a narrativa do produto |
| D-032 | Copy de conversão (headlines, CTAs, value props) | 8 | Sem copy definido as landings são visuais sem mensagem; copy é o coração da conversão |
| D-033 | Social proof na landing (logos + depoimentos fictícios) | 7 | Cria credibilidade imediata com os clientes piloto reais |
| D-034 | Animação / demo interativo no hero | 7 | Screenshot animado do próprio app aumenta muito o impacto da proposta |
| D-035 | OTP mock UI (step de inserir código de 6 dígitos) | 6 | Necessário para completar os fluxos de OTP; qualquer código aceito |
| D-036 | Continuidade visual landing ↔ app (tokens, dark mode) | 6 | Coesão visual reforça percepção de produto maduro |
