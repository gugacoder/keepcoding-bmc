# Brainstorming — Sprint 4 / Wave 5
## Conceito: Perfil — KeepBiz & KeepSolo

---

## Contexto

O TASK.md desta wave define a implementação do conceito de **Perfil** nos dois apps já construídos (`mocks/keep-biz/` e `mocks/keep-solo/`).

Um perfil é a representação do negócio/produto/serviço do usuário no mundo digital — tecnicamente uma coleção de arquivos markdown com frontmatter/YAML usados como contexto de prompting pelo agente interno. O perfil alimenta toda a criação de conteúdo e gestão de presença online.

**Diferença central entre os apps:**
- **KeepSolo**: perfil único e transparente. Usuário não vê "perfil" — vê um processo de setup/onboarding. Depois pode editar em Config.
- **KeepBiz**: múltiplos perfis. Áreas de Criação e Monitor ficam bloqueadas até o primeiro perfil ser criado. Seletor de perfil disponível nessas áreas.

O processo de construção do perfil é conduzido por um **agente conversacional** em 5 etapas: coleta inicial → validação → estudo de nicho → autonomia do usuário → resultado.

---

## Funcionalidades Mapeadas

### O que já existe (sprints 2–3, todos passando)

**KeepBiz** (`mocks/keep-biz/`):
- Shell completo: sidebar 3 zonas, Orchestrator Bar, rotas desktop/mobile
- Social Monitor com feed de menções, score de reputação, gráficos
- Content Forge com lista/grid de conteúdo, calendário editorial, dialog de campanha
- Agent Core: workflows + pipeline de deploy, lista de agentes, chat, conectores, memória, audit log
- Settings: perfil de empresa, equipe, RBAC lite, notificações, plano
- Auth completo: LandingPage, LoginPage, RegisterPage, RouteGuard, AuthContext
- i18n (pt/en/es), DALL-E assets, identidade visual corporativa (azuis/cinzas)

**KeepSolo** (`mocks/keep-solo/`):
- Shell completo: bottom nav 3 rooms (Monitor/Create/Agents), mobile-first
- Monitor: KPIs, lista de leads, funil de vendas, performance de conteúdo
- Create: grid de conteúdo, calendário, dialog de criação
- Agents: workflows + pipeline, agente único, chat, ferramentas
- Config: perfil pessoal, notificações, plano
- Auth completo: LandingPage, LoginPage, RegisterPage, RouteGuard, AuthContext
- i18n, DALL-E assets, identidade visual pessoal (ambers/oranges)

**O que NÃO existe** (a ser criado no sprint-4):
- Nenhuma tela ou fluxo de criação/edição de perfil em nenhum dos apps
- Nenhum gate de área por ausência de perfil no KeepBiz
- Nenhum seletor de perfil nas áreas de Criação e Monitor do KeepBiz
- Nenhum processo de onboarding conversacional ligado à construção de perfil
- Nenhuma estrutura de dados de perfil definida nos apps

---

## Lacunas e Oportunidades

### Lacuna 1 — KeepSolo não tem onboarding de perfil
O app abre diretamente no dashboard após o login. O TASK.md define que a primeira coleta de informações do perfil ocorre no **onboarding** — mas esse fluxo não existe. Sem ele, o agente não tem contexto para sugerir conteúdo.

### Lacuna 2 — KeepSolo não tem tela de edição de perfil em Config
Após o onboarding, o usuário precisa poder modificar o perfil quando quiser. A `ConfigPage` atual tem apenas perfil pessoal (nome, e-mail, foto) — não expõe as informações do perfil de negócio construído no onboarding.

### Lacuna 3 — KeepBiz não tem gestão de múltiplos perfis
O app tem `SettingsPage` com perfil de empresa genérico, mas nenhuma estrutura de múltiplos perfis. Um usuário KeepBiz pode ter dois produtos com comunicação completamente diferente e não há como representar isso.

### Lacuna 4 — Áreas de Criação e Monitor do KeepBiz não são gatekeadas por perfil
O TASK.md define explicitamente que essas áreas ficam **indisponíveis** até o usuário criar seu primeiro perfil. Atualmente ambas são acessíveis diretamente. O gate precisa ser implementado com empty state explicativo e CTA claro.

### Lacuna 5 — Sem seletor de perfil nas áreas de Criação e Monitor do KeepBiz
Quando existem múltiplos perfis, o usuário precisa poder alternar entre "visão consolidada de todos" e "visão de um perfil por vez". Esse controle não existe.

### Lacuna 6 — Processo de construção de perfil não está mapeado em UX
O TASK.md descreve 5 etapas de construção, mas nenhuma delas está traduzida em componentes ou fluxo de UI. A etapa de **validação** (usuário confirma o que o agente "pesquisou") é o diferencial mais sofisticado — o agente mostra o que encontrou e o usuário corrige homônimos/confusões. Essa interação precisa de UX dedicada.

### Lacuna 7 — Sem estrutura de dados de perfil nos apps
Nenhum `data/profiles.ts` ou similar existe em nenhum dos dois apps. A estrutura de dados precisa ser definida com as categorias do perfil: identidade, nicho, posicionamento, tom de voz, plataformas-alvo, concorrentes, diferenciais.

### Oportunidade 1 — O wizard de perfil pode reusar o padrão visual dos wizards existentes
Os wizards de mapeamento de workflow (4 etapas no KeepBiz, 3 no KeepSolo) já definiram um padrão de UX multi-step com stepper horizontal. O wizard de construção de perfil pode usar o mesmo padrão, reduzindo esforço e mantendo consistência.

### Oportunidade 2 — O step de "pesquisa do agente" é o momento mais impressionante do perfil
Assim como a animação de ativação do heartbeat no pipeline foi o clímax do sprint-2, o momento em que o agente mostra "o que eu descobri sobre seu negócio na internet" é o clímax do conceito de perfil. Uma UX bem executada aqui (loading → revelação → validação) define o impacto do demo.

### Oportunidade 3 — Perfil como "cartão de visitas vivo" no KeepBiz
Os cards de perfil na lista de perfis do KeepBiz podem mostrar um resumo visual: nome do perfil, nicho, status (ativo/inativo, completo/incompleto), data de criação. Isso transmite que cada perfil é uma entidade independente com vida própria.

### Oportunidade 4 — Indicação de perfil ativo na Orchestrator Bar (KeepBiz)
A Orchestrator Bar já é um diferencial visual único. Mostrar o nome do perfil ativo nela reforça a ideia de que os agentes estão trabalhando "naquele perfil específico" agora.

---

## Priorização

Scoring considera: dependência técnica (o que bloqueia o quê), impacto no conceito (o que melhor demonstra "perfil") e completude do TASK.md.

| # | Discovery | Score | Justificativa |
|---|---|---|---|
| D-037 | Estrutura de dados de perfil | 10 | Pré-requisito para tudo — sem dados não há telas |
| D-038 | KeepBiz: Lista de perfis (ProfilesPage) | 10 | Ponto de entrada para o conceito KeepBiz; pré-req do gate |
| D-039 | KeepBiz: Wizard de criação de perfil | 10 | Implementa o processo de 5 etapas definido no TASK.md |
| D-040 | KeepBiz: Gate em Criação e Monitor | 9 | Requisito explícito do TASK.md; trava as áreas sem perfil |
| D-041 | KeepBiz: Seletor de perfil em Criação/Monitor | 8 | Requisito explícito do TASK.md; multi-perfil em ação |
| D-042 | KeepSolo: Onboarding de perfil (first-run) | 10 | Sem onboarding o KeepSolo não tem conceito de perfil |
| D-043 | KeepSolo: Edição de perfil em Config | 8 | Permite manutenção pós-onboarding conforme TASK.md |
| D-044 | Step de validação — UX de pesquisa do agente | 9 | Diferencial mais sofisticado do wizard; o clímax do demo |
| D-045 | Step de estudo de nicho — seleção de posicionamento | 7 | Etapa 3 do processo; necessária para completude do wizard |
| D-046 | Indicação de perfil ativo na Orchestrator Bar | 6 | Enriquece o KeepBiz visualmente; baixa dependência técnica |
