# S-002 — KeepBiz Shell + Orchestrator Bar

**Discoveries:** D-004, D-013
**Passada:** 1 (Navegação)
**Prioridade:** 9
**Depende de:** S-001

---

## Objetivo

Implementar o shell de navegação do KeepBiz: sidebar com 3 zonas no desktop, bottom nav no mobile, sub-rotas dentro de cada zona, e a Orchestrator Bar persistente com status da equipe de agentes. Estabelecer a identidade visual corporativa (cores frias, linhas retas, density alta).

---

## Layout

### Desktop (>= 1024px)

```
┌──────────────────────────────────────────────────┐
│ Orchestrator Bar (Team Status: ● 3/4 active)     │
├──────────┬───────────────────────────────────────┤
│ Sidebar  │ Main Content Area                     │
│          │                                       │
│ ● Social │                                       │
│   Monitor│                                       │
│          │                                       │
│ ● Content│                                       │
│   Forge  │                                       │
│          │                                       │
│ ● Agent  │                                       │
│   Core   │                                       │
│          │                                       │
│ ──────── │                                       │
│ ● Config │                                       │
│          │                                       │
│ LanguageSelector                                 │
├──────────┴───────────────────────────────────────┤
│ (footer opcional)                                │
└──────────────────────────────────────────────────┘
```

### Mobile (< 1024px)

```
┌──────────────────────────────┐
│ Orchestrator Bar (compacto)  │
├──────────────────────────────┤
│                              │
│       Main Content Area      │
│                              │
│                              │
├──────────────────────────────┤
│ 🔍 Monitor │ ✏️ Content │ 🤖 Agents │ ⚙ Config │
└──────────────────────────────┘
```

---

## Rotas

```
/                           → redirect to /monitor
/monitor                    → Social Monitor (dashboard)
/monitor/mentions           → Feed de menções
/monitor/alerts             → Alertas
/content                    → Content Forge (lista/grid)
/content/calendar           → Calendário
/content/new                → Nova campanha (dialog ou page)
/content/:id                → Detail panel de conteúdo
/agents                     → Agent Core (lista de agentes)
/agents/:id                 → Detail panel de agente
/agents/workflows           → Lista de workflows
/agents/workflows/new       → Wizard de novo workflow
/agents/workflows/:id       → Detail de workflow (pipeline)
/agents/chat                → Chat com agentes
/agents/chat/:agentId       → Chat com agente específico
/agents/connectors          → Conectores
/agents/audit               → Audit log
/settings                   → Configurações (perfil, equipe, plano, notificações)
```

---

## Componentes

### `AppShell` (layout raiz)

- Renderiza `OrchestratorBar` no topo
- Renderiza `Sidebar` (desktop) ou `BottomNav` (mobile) baseado em breakpoint
- `<Outlet />` para conteúdo da rota ativa

### `Sidebar`

- Largura fixa: 240px (colapsável para 64px com ícones)
- Seções agrupadas por zona:
  - **Social Monitor** com sub-links (Dashboard, Menções, Alertas)
  - **Content Forge** com sub-links (Conteúdo, Calendário)
  - **Agent Core** com sub-links (Agentes, Workflows, Chat, Conectores, Audit Log)
- Separador visual antes de **Configurações**
- `LanguageSwitcher` no rodapé da sidebar
- Indicador de rota ativa (background highlight + borda lateral)
- Ícones Phosphor duotone para cada item

### `BottomNav`

- 4 ícones: Binoculars (Monitor), Megaphone (Content), Robot (Agents), GearSix (Config)
- Label abaixo de cada ícone
- Indicador de aba ativa (cor + peso do ícone)
- Safe area para dispositivos com notch

### `OrchestratorBar`

- Barra horizontal fixa no topo, acima do conteúdo
- Altura: 40px (desktop) / 32px (mobile)
- Conteúdo:
  - Label "Team Status"
  - Dot indicator: green (todos ativos), yellow (algum com warning), red (algum com erro)
  - Contagem: "3/4 agents active"
  - Animação: transição suave de cor (300ms ease)
- Dados: lê do array de agentes em `data/agents.ts`, calcula status agregado
- Background: cor sólida sutil (slate-900 em dark, slate-50 em light)

---

## Identidade Visual KeepBiz

| Elemento | Valor |
|---|---|
| Cores primárias | Slate/Blue (frias) — `slate-900`, `blue-600`, `blue-500` |
| Background | `white` (light) / `slate-950` (dark) |
| Sidebar bg | `slate-50` (light) / `slate-900` (dark) |
| Border radius | `rounded-md` (4px) — linhas retas, cantos discretos |
| Font | System sans-serif (Inter se disponível) |
| Density | Alta — padding menor, mais informação por área |
| Ícones | Phosphor duotone, tamanho 20-24px |

---

## Critérios de Aceite

1. [ ] Sidebar renderiza no desktop com 3 zonas e sub-links clicáveis
2. [ ] Bottom nav renderiza no mobile com 4 ícones
3. [ ] Navegação entre zonas funciona (URL muda, conteúdo troca)
4. [ ] Sub-rotas dentro de cada zona funcionam
5. [ ] Orchestrator Bar exibe status agregado dos agentes (green/yellow/red)
6. [ ] Orchestrator Bar compacta no mobile
7. [ ] Rota `/` redireciona para `/monitor`
8. [ ] Indicador de rota ativa funciona na sidebar e bottom nav
9. [ ] Identidade visual corporativa aplicada (cores frias, density alta)
10. [ ] Layout responsivo: transição sidebar → bottom nav no breakpoint 1024px
