# S-003 — KeepSolo Shell

**Discoveries:** D-005
**Passada:** 1 (Navegação)
**Prioridade:** 9
**Depende de:** S-001

---

## Objetivo

Implementar o shell de navegação do KeepSolo: bottom nav com 3 ícones (Monitor, Create, Agents), sub-rotas dentro de cada room, identidade visual pessoal (cores quentes, cantos arredondados, mais espaço). Mobile-first com melhorias para desktop.

---

## Layout

### Mobile (design primário)

```
┌──────────────────────────────┐
│ Header (logo + lang switch)  │
├──────────────────────────────┤
│                              │
│       Main Content Area      │
│                              │
│                              │
│                              │
├──────────────────────────────┤
│ 👁 Monitor │ ✏ Create │ 🤖 Agents │
└──────────────────────────────┘
```

### Desktop (>= 1024px)

```
┌──────────────────────────────────────────────────┐
│ Header (logo + nav tabs + lang switch + config)  │
├──────────────────────────────────────────────────┤
│                                                  │
│              Main Content Area                   │
│         (max-width container, centered)          │
│                                                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

No desktop, a bottom nav se transforma em tabs no header ou top navigation — sem sidebar (diferencia do KeepBiz).

---

## Rotas

```
/                           → redirect to /monitor
/monitor                    → Dashboard (KPIs, funil, leads, performance)
/monitor/leads              → Lista de leads (expandida)
/monitor/leads/:id          → Sheet com detalhes do lead
/create                     → Grid de conteúdo
/create/new                 → Dialog de criação
/create/calendar            → Calendário mensal
/create/:id                 → Detail de conteúdo
/agents                     → Página "Meu Agente" + workflows
/agents/workflows           → Lista de workflows
/agents/workflows/new       → Wizard de novo workflow (3 etapas)
/agents/workflows/:id       → Detail de workflow (pipeline)
/agents/chat                → Chat direto com "meu agente"
/agents/tools               → Minhas Ferramentas (conectores)
/agents/memory              → Memória do agente
/config                     → Configurações (perfil, notificações, plano)
```

---

## Componentes

### `AppShell` (layout raiz)

- Header fixo no topo com logo, nome do app, LanguageSwitcher
- No desktop: tabs de navegação no header (Monitor, Create, Agents, Config)
- No mobile: bottom nav com 3 ícones + Config no header (gear icon)
- `<Outlet />` para conteúdo

### `BottomNav` (mobile only)

- 3 ícones: Eye (Monitor), PenNib (Create), Robot (Agents)
- Label abaixo de cada ícone
- Indicador ativo: cor quente (amber/orange) + bold
- Safe area para notch
- Sem Config — Config acessível pelo gear icon no header

### `TopNav` (desktop only)

- Tabs horizontais: Monitor, Create, Agents, Config
- Indicador ativo: underline + cor

---

## Identidade Visual KeepSolo

| Elemento | Valor |
|---|---|
| Cores primárias | Amber/Orange (quentes) — `amber-500`, `orange-600`, `amber-400` |
| Background | `white` (light) / `neutral-950` (dark) |
| Accent | `amber-500` |
| Border radius | `rounded-xl` (12px) — cantos arredondados, mais suave |
| Font | System sans-serif (Inter se disponível) |
| Density | Baixa — mais padding, mais espaço, menos itens por tela |
| Ícones | Phosphor duotone, tamanho 24-28px (mais generoso) |
| Cards | `rounded-2xl`, sombra suave, padding generoso |

---

## Critérios de Aceite

1. [ ] Bottom nav renderiza no mobile com 3 ícones (Monitor, Create, Agents)
2. [ ] Desktop mostra tabs no header em vez de bottom nav
3. [ ] Navegação entre rooms funciona
4. [ ] Sub-rotas dentro de cada room funcionam
5. [ ] Rota `/` redireciona para `/monitor`
6. [ ] Gear icon no header mobile leva a Config
7. [ ] Identidade visual pessoal aplicada (cores quentes, rounded-xl, padding generoso)
8. [ ] Layout responsivo: bottom nav → top tabs no breakpoint 1024px
9. [ ] Max-width container no desktop para conteúdo não esticar demais
10. [ ] LanguageSwitcher acessível no header
