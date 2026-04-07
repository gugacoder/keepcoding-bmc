# S-015 — Identidade Visual, Responsividade e Estados

**Discoveries:** D-023, D-024
**Passada:** 4 (Polish)
**Prioridade:** 7
**Depende de:** Todas as specs anteriores

---

## Objetivo

Aplicar polimento final em ambos os apps: identidade visual distinta (KeepBiz fria / KeepSolo quente), responsividade real mobile-first, empty states educativos, loading skeletons, transições suaves, heartbeat animado, e dark mode funcional.

---

## Identidade Visual

### KeepBiz — Corporativo

| Token | Light | Dark |
|---|---|---|
| `--bg-primary` | white | slate-950 |
| `--bg-secondary` | slate-50 | slate-900 |
| `--text-primary` | slate-900 | slate-50 |
| `--accent` | blue-600 | blue-400 |
| `--accent-hover` | blue-700 | blue-300 |
| `--border` | slate-200 | slate-800 |
| `--radius` | 6px (rounded-md) | |
| `--sidebar-width` | 240px | |

Estilo: linhas retas, density alta, padding 12-16px, menos whitespace.

### KeepSolo — Pessoal

| Token | Light | Dark |
|---|---|---|
| `--bg-primary` | white | neutral-950 |
| `--bg-secondary` | amber-50 | neutral-900 |
| `--text-primary` | neutral-900 | neutral-50 |
| `--accent` | amber-500 | amber-400 |
| `--accent-hover` | amber-600 | amber-300 |
| `--border` | neutral-200 | neutral-800 |
| `--radius` | 12px (rounded-xl) | |
| `--card-radius` | 16px (rounded-2xl) | |

Estilo: cantos arredondados, padding 16-24px, mais whitespace, sensação acolhedora.

---

## Responsividade

### Breakpoints

| Breakpoint | Descrição |
|---|---|
| < 640px | Mobile (sm) |
| 640-1023px | Tablet (md) |
| >= 1024px | Desktop (lg) |

### Regras Mobile

- **Thumb zones**: botões de ação na metade inferior da tela
- **Cards**: padding mínimo 12px, não devem parecer apertados
- **Listas**: itens com altura mínima 48px (touch target)
- **Bottom nav**: safe area (padding-bottom para notch)
- **Scroll**: vertical natural, sem scroll horizontal acidental
- **Tabelas**: transformam em cards no mobile

### Desktop Extras

- Painéis lado a lado (detail + list no KeepBiz)
- Tabelas expandidas com todas as colunas
- Sidebar com sub-links expandidos (KeepBiz)
- Calendar com toggle mensal/semanal (Content Forge)

---

## Empty States

Quando uma lista está vazia (zero items), mostrar empty state educativo com:
- Ilustração/ícone grande (Phosphor duotone, 48-64px)
- Título explicativo: ex: "Nenhum workflow ainda"
- Subtítulo com CTA: "Crie seu primeiro workflow para começar a automatizar"
- Botão de ação: "Criar Workflow" → navega para wizard

### Empty states por seção

| Seção | Título | CTA |
|---|---|---|
| Workflows | "Nenhum workflow" | "Criar primeiro workflow" |
| Agentes | "Nenhum agente ativo" | "Crie um workflow para gerar seu primeiro agente" |
| Chat | "Escolha um agente" | "Selecione um agente para conversar" |
| Conectores | "Nenhuma ferramenta conectada" | "Adicionar ferramenta" |
| Conteúdo | "Nenhum conteúdo" | "Criar primeiro post" |
| Monitor (leads) | "Nenhum lead ainda" | "Compartilhe seu link para atrair leads" |
| Audit log | "Nenhuma atividade" | "As ações aparecerão aqui automaticamente" |

---

## Loading Skeletons

Usar componente Skeleton do shadcn para simular carregamento:

- **Pipeline de deploy**: durante delays (Gerar App, Implantar, Treinar), substituir o conteúdo do step por skeleton pulsante
- **Listas**: skeleton de 3-5 linhas enquanto "carrega"
- **Cards**: skeleton retangular com aspecto ratio do card
- **Dashboard KPIs**: skeleton retangular do tamanho do número

Implementação: usar `<Skeleton className="h-4 w-[200px]" />` do shadcn.

---

## Transições

- Troca de rota: fade transition (150ms ease)
- Toggle de view (lista/grid): layout animation (200ms)
- Dialog/Sheet open/close: scale + fade (shadcn default)
- Status badge change: background-color transition (300ms)
- Filtro aplicado: list items fade in/out (150ms stagger)

---

## Heartbeat Pulsante (refinamento)

3 rings concêntricos em loop infinito:

```css
.heartbeat-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.heartbeat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.heartbeat-ring {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid var(--accent);
  animation: heartbeat-pulse 2s ease-out infinite;
}

.heartbeat-ring:nth-child(2) { animation-delay: 0.4s; }
.heartbeat-ring:nth-child(3) { animation-delay: 0.8s; }

@keyframes heartbeat-pulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(3); opacity: 0; }
}
```

Usado na lista de agentes, detail panel, e Orchestrator Bar.

---

## Dark Mode

- Toggle: botão no header (Moon/Sun icon)
- Implementação: class `dark` no `<html>` + Tailwind dark: variant
- Persistência: localStorage
- Ambos os apps suportam dark mode
- shadcn components já suportam dark mode nativamente

---

## Ícones Phosphor (Consistência)

Usar variant `duotone` em todo o app. Mapas de ícones sugeridos:

| Conceito | Ícone |
|---|---|
| Monitor | Binoculars |
| Conteúdo | Megaphone |
| Agentes | Robot |
| Configurações | GearSix |
| Workflow | FlowArrow |
| Chat | ChatCircle |
| Conectores | Plugs |
| Heartbeat | Heartbeat |
| Mic | Microphone |
| Send | PaperPlaneRight |
| Play | Play |
| Pause | Pause |
| Dark mode | Moon / Sun |

---

## Critérios de Aceite

1. [ ] KeepBiz: cores frias (blue/slate), radius menor, density alta
2. [ ] KeepSolo: cores quentes (amber/orange), radius maior, mais espaço
3. [ ] Responsividade: mobile (< 640px) sem overflow horizontal
4. [ ] Touch targets ≥ 48px em mobile
5. [ ] Empty states em todas as listas vazias com ícone + CTA
6. [ ] Loading skeletons durante delays do pipeline
7. [ ] Heartbeat com 3 rings animados em loop
8. [ ] Dark mode toggle funcional em ambos os apps
9. [ ] Dark mode persiste em localStorage
10. [ ] Transições suaves entre rotas e estados
11. [ ] Ícones Phosphor duotone consistentes em todo o app
12. [ ] Tabelas viram cards em mobile
