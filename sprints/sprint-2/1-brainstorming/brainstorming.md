# Brainstorming — Sprint 2 / Wave 3
## Mocks KeepBiz & KeepSolo

---

## Contexto

O TASK.md desta wave define a construção dos mocks interativos dos dois produtos finais da Keep Coding:

- **KeepBiz** — suite para PMEs operacionais (5–200 pessoas), deploy on-premise, sidebar + Orchestrator Bar, tom corporativo com cores frias.
- **KeepSolo** — app para solopreneurs (1 pessoa), SaaS público, bottom nav com 3 ícones, tom pessoal com cores quentes.

Ambos demonstram a **hipótese central** do negócio: mapear workflow → construir app-wrapper → agentes observam → agentes assumem. Os mocks precisam vender essa narrativa visualmente para clientes piloto (Processa Sistemas e Cia Cuidadores) e potenciais investidores.

A task é organizada em 4 passadas:
- **Passada 1** — Scaffold & Navegação (estrutura dos apps)
- **Passada 2** — Zona 3: Agentes & Operações (coração do produto)
- **Passada 3** — Zona 1 (Monitor) e Zona 2 (Conteúdo)
- **Passada 4** — Admin & Polish

Stack definida: Vite + React 19 + TypeScript + Tailwind 4 + shadcn (radix-nova) + Phosphor Icons (duotone).
Comando de setup: `npx shadcn@latest init --preset b43fNjKT2 --template vite --monorepo`.

---

## Funcionalidades Mapeadas

Nenhum código foi implementado ainda nos diretórios `mocks/keep-biz/` ou `mocks/keep-solo/`. Os diretórios contêm apenas `README.md` e `TASKS.md` — documentação de produto, sem scaffolding de projeto.

Existe `apps/keep-blog/` com uma aplicação Next.js de blog com autenticação — produto diferente, não relacionado.

**Estado atual:** zero funcionalidades implementadas. Tudo a construir.

---

## Lacunas e Oportunidades

### Lacuna 1 — Projetos não scaffoldados
Os diretórios `mocks/keep-biz/` e `mocks/keep-solo/` existem mas estão vazios. Antes de qualquer feature, é preciso fazer o setup de cada projeto com Vite + shadcn + i18n + estrutura de `data/`.

### Lacuna 2 — OpenAI não está integrado à estrutura de páginas
O TASK.md menciona usar OpenAI (imagens e vídeos curtos) para gerar criativos que demonstrem a ideia, mas não especifica em quais telas os criativos aparecem. A oportunidade é usar DALL-E/imagens geradas para popular os dados mock com assets visuais reais, especialmente nas seções de Content Forge e Monitor — tornando o demo muito mais convincente.

### Lacuna 3 — Narrativa do "heartbeat" é o momento mais crítico do demo
A animação de ativação do heartbeat (`agente pronto` → `agente ativo`) é o clímax da proposta de valor. O TASK.md descreve "animação especial (pulse expandido / confetti)" mas não detalha o fluxo completo de onboarding. Essa é a cena mais importante para o pitch; vale dedicar atenção especial ao design.

### Lacuna 4 — i18n precisa ser configurado desde o scaffold
O suporte a en/es/pt é requisito, mas se não for configurado desde o início (Passada 1), todas as strings hardcoded precisarão ser migradas depois — retrabalho certo. É uma lacuna de sequenciamento.

### Lacuna 5 — Dados mock realistas são pré-condição para tudo
Sem os arquivos `data/` populados com entidades coerentes (workflows, agentes, leads, menções, conteúdo), nenhuma tela renderiza de forma convincente. Os dados mock precisam ter identidade própria — nomes de empresas, agentes com personalidade, leads com historico — para que o demo pareça um produto real.

### Lacuna 6 — Responsividade mobile é requisito funcional, não polish
O TASK.md especifica mobile-first com bottom nav em ambos os apps. Se a navegação mobile não funcionar desde a Passada 1, o demo quebra em dispositivos reais. Não é detalhe — é arquitetura de navegação.

### Lacuna 7 — RBAC lite não está integrado ao fluxo de convite de equipe
O TASK.md define RBAC lite (Admin/Operador/Viewer) como Passada 4, mas o Dialog de convite de equipe (Passada 4 também) usa os mesmos presets. Se os presets não forem definidos desde a Passada 1 como constantes, haverá divergência entre telas.

### Oportunidade 1 — Dados mock com identidade nos dois pilotos reais
Os clientes piloto são Processa Sistemas e Cia Cuidadores. Usar os nomes e contextos reais desses clientes nos dados mock (ex: "Registro de ponto — Cia Cuidadores") tornaria o demo personalizado e muito mais convincente para esses clientes específicos.

### Oportunidade 2 — Orchestrator Bar como diferencial visual KeepBiz
A barra persistente de status (green/yellow/red) é um elemento único que não existe em nenhum SaaS convencional. Uma implementação polida dela, com animação suave e contagem de agentes ativos, pode ser o detalhe que fica na memória do cliente.

---

## Priorização

As funcionalidades são priorizadas considerando:
1. **Dependência técnica** — o que bloqueia outras coisas
2. **Impacto no pitch** — o que convence o cliente da hipótese central
3. **Esforço estimado** — simplicidade de implementação relativa

### Ranking por score (1–10)

| # | Funcionalidade | Score | Justificativa |
|---|---|---|---|
| D-001 | Scaffold dos dois projetos | 10 | Pré-requisito absoluto; nada funciona sem isso |
| D-002 | Dados mock em `data/` | 10 | Pré-condição para todas as telas renderizarem |
| D-003 | i18n setup (en/es/pt) | 9 | Deve ser configurado no scaffold; migrar depois é retrabalho |
| D-004 | KeepBiz shell — navegação e layout | 9 | Estrutura base do app; Passada 1 |
| D-005 | KeepSolo shell — navegação e layout | 9 | Estrutura base do app; Passada 1 |
| D-006 | Pipeline de deploy (workflow → heartbeat) | 10 | É o coração da narrativa do produto; o clímax do pitch |
| D-007 | Lista + wizard de mapeamento de workflow | 9 | Ponto de entrada da jornada principal; demonstra o loop |
| D-008 | Lista + detail panel de agentes | 9 | Demonstra o estado pós-pipeline; prova que agentes existem |
| D-009 | Animação de ativação do heartbeat | 9 | Momento mais memorável do demo; diferencia o produto |
| D-010 | Memória do agente (ensinar/remover) | 8 | Demonstra controle humano sobre o agente |
| D-011 | Chat com agente | 8 | Demonstra interação direta; reforça personalidade do agente |
| D-012 | Conectores (grid + catálogo) | 7 | Prova que o agente opera ferramentas reais do cliente |
| D-013 | Orchestrator Bar (KeepBiz) | 8 | Diferencial visual único; reforça a ideia de "equipe de agentes" |
| D-014 | Social Monitor KeepBiz | 7 | Zona 1; importante mas secundária ao loop principal |
| D-015 | Monitor KeepSolo (funil + leads) | 7 | Zona 1; demonstra valor para o solopreneur |
| D-016 | Content Forge KeepBiz | 6 | Zona 2; relevante para demonstrar output de conteúdo |
| D-017 | Create KeepSolo | 6 | Zona 2; versão simplificada do Content Forge |
| D-018 | OpenAI — criativos gerados para mock | 7 | Assets visuais reais elevam credibilidade do demo |
| D-019 | Audit log KeepBiz | 6 | Prova transparência e controle; importante para PME que vai on-premise |
| D-020 | KeepBiz: Configurações (perfil, equipe, plano) | 5 | Admin; necessário mas não é o pitch |
| D-021 | KeepSolo: Config | 5 | Admin simplificado; necessário para completude |
| D-022 | RBAC lite (Admin/Operador/Viewer) | 6 | Diferencial para PME com múltiplos usuários |
| D-023 | Identidade visual e responsividade polish | 7 | Mobile-first é requisito funcional, não detalhe; cores definem os dois apps |
| D-024 | Estados e transições (skeleton, empty states, dark mode) | 6 | Polimento final; aumenta credibilidade do produto |

---

*Brainstorming produzido em 2026-04-07. Próxima etapa: derivar specs por passada.*
