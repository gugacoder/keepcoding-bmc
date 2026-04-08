# TASKS — Mocks KeepBiz & KeepSolo

Apps grandes — construção em múltiplas passadas.

---

## Configuration

Para Apps Mobile:
- npx shadcn@latest init --preset b43fNjKT2 --template vite --monorepo

Estrutura de Pastas:
- `mocks/keep-biz/`
- `mocks/keep-solo/`

## OpenAi

Use a chave da OpenAi para inventar criativos para demonstrar a ideia.
Use modelos de desenho e vídeos curtos da OpenAi.

A chave está em `.env` na raiz do repositório.

## Passada 1 — Scaffold & Navegação

1. [ ] Setup dos dois projetos
   - Vite + React 19 + TS + Tailwind 4 + shadcn + Phosphor Icons
   - Um projeto por app: `mocks/keep-biz/`, `mocks/keep-solo/`
   - Setup de i18n (en, es, pt) com seletor de idioma ([README#i18n](README.md#i18n))
   - Dados mock em `data/` ([README#dados-mock](README.md#dados-mock))

2. [ ] KeepBiz — shell com 3 zonas ([README#keepbiz-3-zones](README.md#keepbiz-3-zones))
   - Sidebar no desktop, bottom nav no mobile
   - 3 zonas: Social Monitor, Content Forge, Agent Core
   - Orchestrator Bar persistente (Team Status: green/yellow)
   - Sub-rotas dentro de cada zona
   - Tom corporativo (cores frias, linhas retas)

3. [ ] KeepSolo — shell com 3 rooms ([README#keepsolo-3-rooms](README.md#keepsolo-3-rooms))
   - Bottom nav com 3 ícones: Eye (Monitor), Pen (Create), Robot (Agents)
   - Sub-rotas dentro de cada room
   - Tom pessoal (cores quentes, cantos arredondados)

4. [ ] Todas as páginas renderizam com dados mock estáticos
   - Cards, listas, grids populados com dados de `data/`
   - Sem interatividade ainda — apenas layout e conteúdo visual

---

## Passada 2 — Zona 3: Agentes & Operações (coração)

5. [ ] Lista de workflows com dados mock ([README#workflows](README.md#workflows))
   - Nome, departamento (KeepBiz), status no pipeline, agente associado, data
   - KeepSolo: sem departamento

6. [ ] Wizard de mapeamento de workflow ([README#mapeamento-de-workflow](README.md#mapeamento-de-workflow))
   - KeepBiz: 4 etapas (descrever, departamento, ferramentas, confirmar)
   - KeepSolo: 3 etapas (descrever, ferramentas, confirmar)
   - Ícone de mic decorativo simulando voice-first
   - Ao finalizar → novo workflow na lista com status "mapeado"

7. [ ] Pipeline de deploy funcional ([README#pipeline-de-deploy](README.md#pipeline-de-deploy))
   - Stepper visual horizontal no detail panel
   - Botões por estado: "Gerar App" → "Implantar" → "Iniciar Treinamento" → "Ativar Heartbeat"
   - Cada clique avança com delay simulado
   - Animação especial ao ativar heartbeat
   - Ao chegar em "agente ativo", aparece na lista de agentes

8. [ ] Lista e detail panel de agentes ([README#agentes](README.md#agentes))
   - KeepBiz: nome, role, departamento, status (Idle/Working/Waiting), heartbeat
   - Detail: Play/Pause (com confirmação), Atividades (timeline), Treinamento (barra), "Conversar" (navega ao chat)
   - Auto-prompt ao criar: "Standalone bot or wrap in app?" (KeepBiz)
   - KeepSolo: card "Meu Agente" com controles diretos, hints autônomos

9. [ ] Memória do agente ([README#agentes](README.md#agentes))
   - Itens agrupados por categoria (operações, preferências, regras)
   - Remover item (X) com confirmação
   - "Ensinar algo novo" → textarea + confirmar → item aparece

10. [ ] Chat funcional ([README#chat](README.md#chat))
    - KeepBiz: seletor de agente + painel de contexto no desktop
    - KeepSolo: chat direto com "meu agente"
    - Input → Enter/click → mensagem na conversa → "digitando..." 1-2s → resposta contextual
    - Pool de 5-8 respostas por agente (não genéricas)
    - Scroll automático, limpar input

11. [ ] Conectores ([README#conectores](README.md#conectores))
    - KeepBiz: grid com filtros de categoria (pills funcionais), "Adicionar" abre catálogo, config mock, "Desconectar" com confirmação
    - KeepSolo: lista simplificada, "Adicionar ferramenta", "Desconectar"

12. [ ] Audit log (KeepBiz) ([README#agentes](README.md#agentes))
    - Tabela de ações recentes: quem triggered, que dado tocou, timestamp
    - Acessível via Agent Core e via Configurações

---

## Passada 3 — Zona 1 (Monitor) e Zona 2 (Conteúdo)

13. [ ] KeepBiz: Social Monitor ([README#zona-1-monitor](README.md#zona-1-monitor))
    - Feed de menções (texto, fonte, sentimento, data)
    - Score de reputação com trend
    - Alertas clicáveis
    - Gráfico de trends
    - Filtro por fonte funcional
    - Seletor de período (7d/30d/90d) troca números

14. [ ] KeepSolo: Monitor ([README#zona-1-monitor](README.md#zona-1-monitor))
    - KPIs, lista de leads, funil visual, performance de conteúdo
    - Seletor de período funcional
    - Click em lead abre Sheet com detalhes
    - Click em etapa do funil filtra leads

15. [ ] KeepBiz: Content Forge ([README#zona-2-conteudo](README.md#zona-2-conteudo))
    - Lista/grid com status badges + filtro por status
    - "Nova campanha" → Dialog (título, tipo, plataforma, autor, briefing, data) → adiciona com "rascunho"
    - Preview panel: "Aprovar", "Solicitar revisão", "Agendar" (date picker mock)
    - Timeline de status no detail panel
    - Swarm indicator: quem está fazendo o quê (research/draft/schedule)
    - Calendário mensal/semanal: click em item abre detail, click em dia vazio abre criação

16. [ ] KeepSolo: Create ([README#zona-2-conteudo](README.md#zona-2-conteudo))
    - Grid de cards com status
    - "Criar post" → Dialog simplificado → adiciona no grid
    - "Aprovar" → "pronto", "Publicar" → "publicado"
    - Calendário simples mensal

---

## Passada 4 — Admin & Polish

17. [ ] KeepBiz: Configurações ([README#gestao-admin](README.md#gestao-admin))
    - Perfil da empresa: edit/save com toast
    - Equipe: lista + "Convidar" (Dialog email + role: Admin/Operador/Viewer)
    - Notificações: toggles por categoria, persistem no state
    - Plano: card atual + "Upgrade" mostra comparação mock
    - Seletor de idioma (en/es/pt)

18. [ ] KeepSolo: Config ([README#gestao-admin](README.md#gestao-admin))
    - Perfil: edit/save com toast
    - Notificações: toggles simplificados
    - Plano: card + upgrade mock
    - Seletor de idioma (en/es/pt)

19. [ ] RBAC lite (KeepBiz) ([README#agentes](README.md#agentes))
    - Presets: Admin, Operador, Viewer
    - Human-in-loop: agente pede confirmação para ações high-stakes (dinheiro, contratos)
    - Permissões visíveis no perfil do membro da equipe

20. [ ] Identidade visual e responsividade ([README#design](README.md#design))
    - KeepBiz: corporativo, cores frias, density alta, sidebar + painéis lado a lado
    - KeepSolo: pessoal, cores quentes, cantos arredondados, bottom nav
    - Mobile: thumb zones, cards não apertados
    - Desktop: aproveitar espaço (painéis, tabelas expandidas)

21. [ ] Estados e transições
    - Empty states educativos para listas vazias
    - Loading skeletons para ações com delay (gerar app, treinar)
    - Transições suaves entre estados
    - Heartbeat pulsante animado (3 rings)
    - Phosphor duotone consistente
    - Dark mode funcional

---

## SPECIFICATIONS

# Mocks -- KeepBiz & KeepSolo

> Fonte de verdade: `-grok-bmc-thread-part-2.md` + documentação markdown na pasta pai.

---

## O que são KeepBiz e KeepSolo

São os **produtos finais** da Keep Coding -- plataformas que o cliente usa diretamente.

- **KeepBiz** -- suite completa para PMEs operacionais (múltiplos departamentos, equipe, estrutura). Deploy on-premise no servidor do cliente.
- **KeepSolo** -- versão enxuta para solopreneurs (uma pessoa tocando tudo). SaaS público hospedado por nós.

A diferença é de **abrangência e proposição**, não de arquitetura. Ambos entregam as mesmas 3 zonas, mas KeepSolo simplifica a interface para quem opera sozinho.

### O que NÃO são

Não são dashboards internos da Keep Coding. GRZ, Agency e Workflows são **infraestrutura invisível** -- o motor por baixo. O cliente nunca vê essas marcas.

---

## Hipótese Central {#hipotese-central}

1. **Mapear** o workflow do pessoal do cliente
2. **Agente constrói wrapper app** via Workflow factory que replica o workflow
3. **Entregar** o app ao pessoal — trabalham pelo nosso app (replica ações no ERP/ferramentas via MCP/API)
4. **Agentes observam** silenciosamente cada ação no app — aprendem o padrão
5. **Agente assume** — "I got this" — ativa o heartbeat, roda a tarefa autonomamente
6. **Endgame:** pessoal não faz mais a tarefa, output igual, headcount cai

> Não construímos ERPs. O app-wrapper é o cavalo de tróia: canaliza o trabalho por nós, agentes aprendem, depois assumem.

---

## Arquitetura de 3 Zonas {#arquitetura-3-zonas}

Ambos os apps são organizados em **3 zonas principais**. Esta é a estrutura de navegação primária -- não uma lista flat de páginas.

### KeepSolo -- 3 Rooms {#keepsolo-3-rooms}

Bottom nav com 3 ícones:

| Room | Ícone | Propósito |
|---|---|---|
| **Monitor** | Eye | Dashboard de funil, leads, conversões, performance |
| **Create** | Pen | Criação de conteúdo, calendário, AI prompts |
| **Agents** | Robot | Helpers, chat, workflows, ferramentas |

KeepSolo **não é só para escritores** -- é para qualquer solopreneur: mecânico, padeiro, tutor, designer, personal trainer. As 3 rooms se adaptam ao que o usuário faz.

### KeepBiz -- 3 Zones + Orchestrator {#keepbiz-3-zones}

Sidebar no desktop, bottom nav no mobile. As 3 zonas + barra de status:

| Zone | Codinome | Propósito |
|---|---|---|
| **Social Monitor** | The Mirror | Crawl de menções, reviews, trends → score de reputação + alertas. Dashboard passivo de inteligência |
| **Content Forge** | The Megaphone | Templates de processo, calendário de progresso dos agentes, swarm (research → draft → schedule) |
| **Agent Core** | The Engine Room | Multi-agent com roles, department-aware, permissões, status por agente |
| **Orchestrator Bar** | (glue) | Barra persistente: "Team Status" — green se todos rodando, yellow se gargalo |

---

## Zona 1 -- Monitor {#zona-1-monitor}

### KeepBiz: Social Monitor / "The Mirror"

Dashboard passivo de inteligência:
- **Feed de menções**: lista cronológica de menções da marca (redes sociais, reviews, fóruns)
- **Score de reputação**: número agregado com trend (subindo/descendo)
- **Alertas**: notificações quando algo relevante acontece (menção negativa, pico de atividade)
- **Gráfico de trends**: volume de menções ao longo do tempo
- **Filtro por fonte**: Twitter/X, Google Reviews, Instagram, etc.

**Ações no mock:**
- Seletor de período (7d / 30d / 90d) troca todos os números
- Click em menção abre detalhe (texto, fonte, sentimento, data)
- Click em alerta abre contexto
- Filtro por fonte funciona

### KeepSolo: Monitor

Dashboard de funil pessoal:
- **KPIs**: leads novos, conversões, receita, performance de conteúdo
- **Lista de leads**: nome, origem, status, data
- **Funil visual**: etapas (visitante → lead → contato → cliente)
- **Performance de conteúdo**: posts recentes com métricas (views, clicks, engagement)

**Ações no mock:**
- Seletor de período (7d / 30d / 90d) troca números
- Click em lead abre Sheet com detalhes mock
- Click em etapa do funil mostra leads naquela etapa

---

## Zona 2 -- Conteúdo {#zona-2-conteudo}

### KeepBiz: Content Forge / "The Megaphone"

Não é só criação de posts -- são **templates de processo**:
- **Lista/grid de conteúdo**: cada item com status (rascunho, em revisão, aprovado, publicado, agendado)
- **Swarm de agentes**: indicador visual de quem está fazendo o quê (research, draft, schedule)
- **Calendário**: view mensal e semanal, mostra progresso dos agentes por tarefa
- **Criação**: Dialog com título, tipo (post/short/criativo/campanha), plataforma, autor (da equipe), briefing, data alvo
- **Preview panel**: visualização do conteúdo com ações

**Ações no mock:**
- "Nova campanha" abre Dialog de criação → ao submeter, aparece na lista com status "rascunho"
- Click em item abre preview panel
- "Aprovar" muda status → badge atualiza na lista
- "Solicitar revisão" muda status
- "Agendar" abre date picker mock → muda status para "agendado"
- Timeline de status no detail panel (criado → em revisão → aprovado → publicado)
- Calendário: click em item abre detail, click em dia vazio abre criação com data pre-preenchida
- Toggle Mensal/Semanal no desktop
- Filtro por status funciona

### KeepSolo: Create

Versão pessoal, mais direta:
- **Grid de conteúdo**: cards com thumbnail, título, status
- **Criação simplificada**: Dialog com título, tipo, canal, briefing, data
- **Calendário simples**: view mensal

**Ações no mock:**
- "Criar post" abre Dialog → ao submeter, aparece no grid
- "Aprovar" → status "pronto"
- "Publicar" → status "publicado"
- Badges atualizam em tempo real

---

## Zona 3 -- Agentes & Operações {#zona-3-agentes}

Esta é a zona mais complexa. Contém sub-seções: Workflows, Agentes, Conectores, Chat.

### Workflows {#workflows}

#### Lista de Workflows

Cada workflow na lista mostra: nome, departamento (KeepBiz), status no pipeline, agente associado (se houver), data de criação.

**Estados do pipeline** (ver [Pipeline de Deploy](#pipeline-de-deploy)):
`mapeado` → `app em criação` → `app pronto` → `implantado` → `agente treinando` → `agente ativo`

#### Mapeamento de Workflow {#mapeamento-de-workflow}

Experiência "leisure" -- o mock simula isso como um wizard conversacional:

**KeepBiz -- Wizard 4 etapas:**
1. **Descrever**: textarea grande + placeholder inspirador ("Descreva o que o pessoal faz..."). Simula o voice-first com ícone de mic decorativo
2. **Departamento**: select (RH, Financeiro, Operações, Marketing, Atendimento)
3. **Ferramentas**: multi-select dos conectores configurados (Google Sheets, ERP, WhatsApp, etc.)
4. **Confirmar**: resumo do que foi descrito + botão "Criar Workflow"

**KeepSolo -- Wizard 3 etapas:**
1. **Descrever**: textarea ("O que você faz repetidamente?")
2. **Ferramentas**: multi-select simplificado
3. **Confirmar**: resumo + "Criar"

**Ação:** ao finalizar, novo workflow aparece na lista com status "mapeado".

#### Pipeline de Deploy {#pipeline-de-deploy}

Stepper visual horizontal no detail panel do workflow. Cada estado tem um botão de ação:

| Estado | Botão | Efeito |
|---|---|---|
| `mapeado` | "Gerar App" | Delay 2s → muda para `app em criação` → delay 3s → `app pronto` |
| `app pronto` | "Implantar" | Delay 1s → `implantado` |
| `implantado` | "Iniciar Treinamento" | Delay 2s → `agente treinando` (barra de progresso) |
| `agente treinando` | (automático) | Barra de progresso avança → `agente pronto` |
| `agente pronto` | "Ativar Heartbeat" | Animação especial (pulse expandido / confetti) → `agente ativo` |

Quando chega em "agente ativo", o workflow aparece também na lista de agentes com heartbeat pulsando.

### Agentes {#agentes}

#### KeepBiz: Agent Core / "The Engine Room"

- **Lista de agentes**: cada um com nome, role, departamento, status (Idle / Working / Waiting on data), heartbeat visual
- **Roles exemplo**: "Invoice Hunter", "Lead Nurturer", "Schedule Keeper", "Content Drafter"
- **Detail panel** ao clicar:
  - Status & Controle: Play/Pause com Dialog de confirmação
  - Memória: lista de itens por categoria, removíveis (X), "Ensinar algo novo"
  - Atividades: timeline do que o agente fez recentemente
  - Treinamento: barra de progresso + "Refinar via chat"
  - "Conversar": navega para Chat com agente pre-selecionado
- **Orchestrator Bar** (persistente): indicador de status geral (green/yellow/red)

**Princípios KeepBiz (afetam o mock):**
- Apps são a porta principal, não chat direto com agentes
- Ao criar agente, auto-prompt: "Want this as a standalone bot? Or wrap it in an app?"
- RBAC lite: presets simples (Admin, Operador, Viewer), sem menus profundos
- Human-in-loop para high-stakes: agente pede confirmação para ações com dinheiro/contratos
- Audit log: lista de ações recentes (quem triggered, que dado tocou)

#### KeepSolo: Agents (Helpers)

- **Página "Meu Agente"**: card único (ou poucos) com status, heartbeat, controles diretos
- **Pause/Resume** direto no card, sem dialog
- **Memória**: seção expansível com itens por categoria, "Ensinar algo novo"
- **Hints**: seção de sugestões autônomas ("Notei que você faz X toda segunda -- quer que eu assuma?")

### Chat com Agentes {#chat}

Interface de conversa para interagir com agentes, dar feedback, refinar treinamento.

**KeepBiz:**
- Seletor de agente (dropdown ou lista lateral)
- Pool de 5-8 respostas contextuais **por agente** (respostas variam por role)
- Painel de contexto ao lado no desktop (memória, status, último treinamento)

**KeepSolo:**
- Chat direto com o agente (sem seletor -- é sempre "meu agente")
- Pool de respostas que variam conforme o que o usuário digitou

**Comum:**
- Input conectado ao state, envio por click ou Enter
- Indicador "digitando..." com delay 1-2s antes da resposta
- Scroll automático para última mensagem
- Limpar input após envio
- Bolhas diferenciadas (usuário vs agente)

### Conectores {#conectores}

Ferramentas que o sistema se integra (Google Workspace, Microsoft 365, MCPs, APIs REST, WhatsApp, Slack, etc.)

**KeepBiz:**
- Grid de conectores com ícone, nome, status (conectado/desconectado)
- Filtros de categoria (pills): Produtividade, Comunicação, Finanças, etc. -- funcionam
- "Adicionar conector": abre catálogo grid com opções disponíveis
- Click em conector existente: painel de configuração mock (API key field, OAuth button mock)
- "Desconectar": Dialog de confirmação

**KeepSolo:**
- Lista simplificada de "Minhas Ferramentas"
- "Adicionar ferramenta": lista com opções
- "Desconectar" com confirmação

---

## Gestão / Admin {#gestao-admin}

### KeepBiz: Configurações

- **Perfil da empresa**: form com edit/save + toast de confirmação
- **Equipe**: lista de membros + "Convidar" (Dialog com email + role select: Admin/Operador/Viewer)
- **Notificações**: toggles agrupados por categoria, persistem no state da sessão
- **Plano**: card do plano atual + "Fazer upgrade" mostra comparação de planos mock
- **Audit log**: tabela de ações recentes

### KeepSolo: Config

- **Perfil pessoal**: form com edit/save + toast
- **Notificações**: toggles simplificados
- **Plano**: card do plano + upgrade mock

---

## Dados Mock {#dados-mock}

Cada app deve ter dados mock realistas em arquivos separados (`data/`). Exemplos:

**Workflows:**
- "Registro de chamadas → Google Sheets" (dept: Atendimento)
- "Follow-up de leads por email" (dept: Marketing)
- "Conciliação bancária semanal" (dept: Financeiro)
- "Agendamento de reuniões" (dept: RH)
- "Controle de estoque" (dept: Operações)

**Agentes:**
- "Invoice Hunter" -- Financeiro, status: Working, heartbeat ativo
- "Lead Nurturer" -- Marketing, status: Idle
- "Schedule Keeper" -- RH, status: Working
- "Content Drafter" -- Marketing, status: Waiting on data

**Conectores:**
- Google Workspace (conectado), Microsoft 365 (conectado), WhatsApp Business (conectado)
- Slack (desconectado), Trello (desconectado), ERP XYZ (conectado via MCP)

**Conteúdo:**
- "Post: Lançamento de verão" -- status: aprovado, plataforma: Instagram
- "Short: Behind the scenes" -- status: em revisão, plataforma: TikTok
- "Campanha: Black Friday" -- status: rascunho, plataforma: Multi

**Leads (Monitor):**
- 8-10 leads com nome, email, origem, status no funil, data

**Menções (KeepBiz Monitor):**
- 5-8 menções de fontes variadas (Twitter, Google Reviews, Instagram) com sentimento (positivo/neutro/negativo)

---

## i18n {#i18n}

Apps disponíveis em **3 idiomas**: English, Español, Português.

- Seletor de idioma acessível nas configurações e/ou no header
- Todas as strings de UI via sistema de i18n (arquivos de tradução por locale)
- Dados mock permanecem no idioma original (não traduzir nomes de empresas, leads, etc.)
- Default: Português

---

## Design {#design}

- **Mobile-first** com melhorias significativas para desktop
- **Mobile:** bottom nav, telas focadas, ações rápidas
- **Desktop:** sidebar, painéis lado a lado, tabelas expandidas
- **Stack:** Vite + React 19 + TypeScript + shadcn (radix-nova) + Phosphor Icons (duotone) + Tailwind CSS 4

### Identidade visual

- **KeepBiz**: corporativo, cores frias, density alta, linhas retas, sidebar + painéis
- **KeepSolo**: pessoal, cores quentes, cantos arredondados, menos camadas, mais espaço

---

## Diferenças KeepBiz vs KeepSolo {#diferencas}

| Aspecto | KeepBiz | KeepSolo |
|---|---|---|
| Público | PMEs com retaguarda (5-200 pessoas) | Solopreneur (1 pessoa) |
| Deploy | On-premise | SaaS público |
| Navegação | Sidebar + Orchestrator Bar | Bottom nav 3 ícones |
| Departamentos | Múltiplos (RH, financeiro, ops, marketing) | Não tem -- "meu negócio" |
| Agentes | Vários, roles específicas, department-aware | Poucos, generalistas |
| Equipe | Gestão de permissões, RBAC lite | Só o dono |
| Workflows | Wizard 4 etapas (com departamento) | Wizard 3 etapas (pessoal) |
| Monitor | Social Monitor (menções, reputação) | Funil pessoal (leads, conversão) |
| Conteúdo | Content Forge (swarm, templates) | Create (posts, calendário) |
| Tom | Profissional, corporativo | Pessoal, direto |
| Idiomas | en, es, pt | en, es, pt |

---

## Estrutura

```
mocks/
├── README.md          (este arquivo)
├── TASKS.md           (checklist de implementação)
├── keep-biz/          (KeepBiz -- suite para PMEs)
└── keep-solo/         (KeepSolo -- app para solopreneurs)
```
