# PRP-002 — KeepBiz Shell & Orchestrator Bar

**Passada:** 1 — Scaffold & Navegação
**Specs:** S-002
**Discoveries:** D-004, D-013
**Prioridade:** 9

---

## Objetivo

Implementar o shell de navegação do KeepBiz com sidebar desktop, bottom nav mobile, Orchestrator Bar persistente e identidade visual corporativa (cores frias, density alta, linhas retas).

## Escopo

### Telas / Componentes
- **Layout principal**: sidebar (240px, colapsível a 64px) + área de conteúdo
- **Sidebar desktop**: 3 zonas (Social Monitor, Content Forge, Agent Core) + Settings
- **Bottom nav mobile**: 3 ícones + Settings (breakpoint < 1024px)
- **Orchestrator Bar**: barra persistente no topo com Team Status (green/yellow/red), contagem de agentes ativos
- **Páginas placeholder**: cada rota renderiza título + dados mock estáticos em cards/listas

### Rotas
```
/monitor          → Social Monitor (placeholder)
/content          → Content Forge (placeholder)
/content/calendar → Calendário (placeholder)
/agents           → Agent Core (placeholder)
/agents/chat      → Chat (placeholder)
/agents/connectors→ Conectores (placeholder)
/settings         → Configurações (placeholder)
```

### Identidade Visual
- Paleta: slate/blue (cores frias)
- Border radius: 6px (rounded-md)
- Padding: 12-16px (density alta)
- Font: system sans-serif
- Ícones: Phosphor duotone

## Features

1. **F-002-A**: Layout com sidebar desktop — 3 zonas com ícones Phosphor, item ativo destacado, colapsível
2. **F-002-B**: Bottom nav mobile — 3 ícones + settings, breakpoint responsivo
3. **F-002-C**: Configuração de rotas — react-router-dom com nested routes e outlets
4. **F-002-D**: Orchestrator Bar — barra persistente com indicador green/yellow/red e contagem de agentes (lê dados mock)
5. **F-002-E**: Páginas placeholder — cada rota renderiza componente com título e dados mock estáticos em layout de grid
6. **F-002-F**: Tokens de design KeepBiz — variáveis CSS / classes Tailwind para paleta corporativa

## Limites

- NÃO implementar funcionalidades das zonas (→ PRP-004 a PRP-011)
- NÃO implementar dark mode (→ PRP-014)
- Placeholders devem usar dados mock de `src/data/` mas sem interatividade

## Dependências

- **PRP-001** — scaffold, i18n e dados mock devem existir
