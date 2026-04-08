# Brainstorming — Sprint 5 / Wave 6
## Conceito: Autocriação — KeepBiz & KeepSolo

---

## Contexto

O TASK.md desta wave define a implementação do conceito de **Autocriação** nos dois apps já construídos (`mocks/keep-biz/` e `mocks/keep-solo/`).

A autocriação é o diferencial central da plataforma: o sistema **não é um "faça você mesmo"** — é um **"nós fazemos pra você, embora você possa fazer também"**. A plataforma cria campanhas, gerencia postagens e cuida da imagem do cliente nas redes de forma autônoma, usando o **perfil** como base de conhecimento (perfil este implementado no sprint-4).

**Ciclo do agente interno:**
1. Investigação — pesquisa sobre nicho, tendências e concorrentes
2. Ideação — geração de ideias alinhadas ao posicionamento do perfil
3. Criação — produção de textos, hashtags, horários
4. Gestão — agendamento e publicação
5. Análise — monitoramento de resultados e retroalimentação

**Diferença entre os apps:**
- **KeepSolo**: um perfil, um fluxo de sugestões. Usuário aprova/edita/rejeita.
- **KeepBiz**: autocriação por perfil — cada perfil tem seu próprio fluxo independente. Visão consolidada ou por perfil.

---

## Funcionalidades Mapeadas

### O que já existe (sprints 2–4, todos passando)

**Infraestrutura compartilhada:**
- Scaffold completo em ambos os apps (Vite + React 19 + TS + Tailwind + shadcn + Phosphor Icons)
- Dados mock realistas com nomes próximos dos clientes piloto
- Auth completo (Landing, Login, Register, RouteGuard, AuthContext)
- i18n (pt/en/es) em ambos os apps
- DALL-E assets e identidade visual por app

**KeepBiz** (`mocks/keep-biz/`):
- Shell completo: sidebar 3 zonas, Orchestrator Bar, rotas desktop/mobile
- Social Monitor com feed de menções, score de reputação, gráficos
- Content Forge (ContentPage) com lista/grid de conteúdo, calendário editorial, dialog de campanha
- ContentThumbnail, ProfileSelector componentes já existentes
- Agent Core: workflows, pipeline, lista de agentes, chat, conectores, memória, audit log
- Settings: perfil de empresa, equipe, RBAC lite, notificações, plano
- **Sprint 4**: estrutura de dados de perfil, ProfilesPage, ProfileWizardPage (5 etapas), ProfileGate, ProfileSelector, seletor de perfil em ContentPage/MonitorPage, Orchestrator Bar com perfil ativo

**KeepSolo** (`mocks/keep-solo/`):
- Shell: bottom nav 3 rooms (Monitor/Create/Agents), mobile-first
- Monitor: KPIs, lista de leads, funil de vendas, performance de conteúdo
- Create (CreatePage): grid de conteúdo, calendário, dialog de criação — fluxo **100% manual**
- Agents: workflows, pipeline, agente único, chat, ferramentas
- Config: perfil pessoal, notificações, plano
- **Sprint 4**: SoloProfileContext, OnboardingPage (4 etapas), BusinessProfileSection em ConfigPage, indicador de completude, i18n Meu Negócio

**O que NÃO existe** (a ser criado no sprint-5):
- Nenhum conteúdo marcado como gerado pela IA (`source: 'ai'`) em qualquer dos apps
- Nenhum feed de sugestões de conteúdo propostas pelo sistema
- Nenhum fluxo de aprovação/edição/rejeição de sugestões de IA
- Nenhuma campanha proposta automaticamente pelo agente
- Nenhuma indicação visual de "Gerado pela IA" vs "Criado por você"
- Nenhum indicador de atividade do agente criando conteúdo
- Nenhuma visão do calendário com conteúdo sugerido vs manual

---

## Lacunas e Oportunidades

### Lacuna 1 — ContentItem não tem campo de origem (ai vs manual)
O tipo `ContentItem` em ambos os apps não distingue se o conteúdo foi criado pelo sistema ou pelo usuário. Sem esse campo, não é possível filtrar sugestões, aplicar visuais distintos ou construir o fluxo de aprovação. É o pré-requisito técnico de tudo.

### Lacuna 2 — KeepSolo CreatePage não tem feed de sugestões de IA
A CreatePage atual exibe apenas conteúdo já existente (todos de origem manual). Não há um painel, aba ou seção que mostre "O que o sistema preparou para você". O TASK.md é explícito: o **padrão é o sistema propor** — mas o sistema não propõe nada.

### Lacuna 3 — KeepBiz ContentPage não tem feed de sugestões de IA
Mesmo problema do KeepSolo. A ContentPage filtra por perfil mas todos os itens são manuais. Não há diferenciação entre conteúdo já aprovado e conteúdo aguardando aprovação do usuário.

### Lacuna 4 — Sem fluxo de aprovação/edição/rejeição de sugestões
O TASK.md define que o usuário pode "aceitar, editar ou rejeitar" — mas nenhuma dessas ações existe. Conteúdo manual não precisa de aprovação. Conteúdo de IA precisa passar pelo usuário antes de ser agendado/publicado. Esse fluxo é o core da UX de autocriação.

### Lacuna 5 — Sem campanhas propostas automaticamente
O TASK.md menciona "campanhas propostas automaticamente". O KeepBiz tem um dialog de campanha manual. Nenhum dos apps tem o agente propondo uma campanha completa (série de posts com tema, datas, objetivo). Essa feature é o clímax do conceito de autocriação.

### Lacuna 6 — Sem indicação visual de origem do conteúdo
Cards de conteúdo não têm badge "Gerado pela IA" ou "Criado por você". Sem essa distinção, o usuário não entende qual conteúdo veio do sistema e qual ele mesmo criou — o diferencial invisível não é percebido.

### Lacuna 7 — Sem indicador de atividade do agente
Não há nenhum elemento visual indicando que o agente está trabalhando ("Agente pesquisando tendências...", "Criando rascunhos..."). A narrativa de autonomia depende dessa presença — o sistema precisa parecer vivo.

### Lacuna 8 — Calendário não diferencia IA vs manual
O calendário editorial em ambos os apps mostra todos os eventos iguais. Conteúdo sugerido pela IA deveria aparecer com visual diferente (ex: borda pontilhada, ícone de robot), sinalizando que ainda precisa de aprovação antes de ser publicado.

### Lacuna 9 — KeepBiz sem visão consolidada de sugestões por todos os perfis
Quando o usuário está em modo "Todos os perfis", não há como ver as sugestões de IA agrupadas por perfil. Um gestor KeepBiz precisa aprovar campanhas de todos os seus negócios de uma vez — essa visão unificada não existe.

### Lacuna 10 — Monitor sem retroalimentação da IA
O TASK.md menciona "sugestões de ajuste baseadas em dados". A MonitorPage tem métricas mas nenhuma delas dispara uma sugestão da IA ("Seu conteúdo de LinkedIn teve 3x mais engajamento — sugerindo mais posts para essa plataforma"). Esse loop fechado falta.

### Oportunidade 1 — Feed de sugestões como seção destacada no topo da CreatePage/ContentPage
Ao invés de misturar sugestões com conteúdo manual, criar uma seção separada "Sugestões para você" no topo da página. Cards com visual diferenciado (anel de cor, badge de IA). Botões diretos: Aprovar / Editar / Rejeitar. Essa seção some quando vazia.

### Oportunidade 2 — O momento de campanha proposta é o clímax visual do demo
Assim como o loading de pesquisa de perfil foi o clímax do sprint-4, a proposta de campanha pela IA é o clímax do sprint-5. Uma animação de "elaborando campanha..." seguida de um card expandido com título da campanha, série de posts, datas sugeridas e CTA "Aceitar campanha" é o momento mais impressionante para uma demo.

### Oportunidade 3 — Badge de IA reutiliza padrão do Robot icon já importado
O KeepBiz já importa `Robot` de `@phosphor-icons/react`. O badge "Gerado pela IA" pode usar esse ícone com um fundo violeta/roxo (consistent com o padrão de cores de agente já usado nos apps). Zero custo de design.

### Oportunidade 4 — Indicador de atividade do agente na Orchestrator Bar (KeepBiz)
A Orchestrator Bar já exibe "Swarm ativo" com ícone de bolt. Estender para mostrar "Agente criando X rascunhos..." quando o sistema está em ciclo de criação. KeepSolo: o bottom nav pode ter um badge pulsante no room "Criar" indicando atividade.

### Oportunidade 5 — Dados mock de IA são triviais de criar mas maximizam o impacto narrativo
Adicionar 3–5 ContentItems com `source: 'ai'` e status `'rascunho'` em cada app é trivial tecnicamente mas transforma completamente a narrativa — o sistema "já trabalhou" antes do usuário abrir a tela.

---

## Priorização

| # | Discovery | Impacto | Esforço | Score |
|---|-----------|---------|---------|-------|
| 1 | Campo `source` no ContentItem (pré-requisito) | Crítico | Mínimo | 10 |
| 2 | Mock data de sugestões de IA em ambos os apps | Crítico | Baixo | 10 |
| 3 | KeepSolo: seção "Sugestões para você" na CreatePage | Alto | Médio | 10 |
| 4 | Fluxo Aprovar/Editar/Rejeitar sugestões de IA | Alto | Médio | 10 |
| 5 | KeepBiz: seção de sugestões na ContentPage | Alto | Médio | 9 |
| 6 | Badge "Gerado pela IA" nos cards de conteúdo | Alto | Baixo | 9 |
| 7 | Campanha proposta automaticamente pela IA | Máximo | Alto | 9 |
| 8 | Indicador de atividade do agente (Orchestrator Bar / bottom nav) | Médio | Baixo | 8 |
| 9 | Calendário diferenciando IA vs manual | Médio | Médio | 8 |
| 10 | KeepBiz: visão consolidada de sugestões por perfil | Médio | Médio | 7 |
| 11 | i18n para toda a UX de autocriação | Médio | Médio | 7 |
| 12 | Monitor: sugestão de ajuste baseada em dados | Baixo | Médio | 6 |

**Ordem lógica de implementação:**
1. Tipos de dados (D-047) — pré-requisito absoluto
2. Mock data de IA (D-048) — pré-requisito para telas renderizarem
3. Seção de sugestões KeepSolo (D-049) + Badge (D-052) — UX fundamental
4. Fluxo aprovação (D-050) — core do conceito
5. Seção de sugestões KeepBiz (D-051) + Campanha (D-053) — clímax do demo
6. Indicador de atividade (D-054) + Calendário (D-055) — polimento
7. Visão consolidada (D-056) + i18n (D-057) — completude
8. Monitor feedback (D-058) — enriquecimento
