# PRP-003 — KeepSolo Shell

**Passada:** 1 — Scaffold & Navegação
**Specs:** S-003
**Discoveries:** D-005
**Prioridade:** 9

---

## Objetivo

Implementar o shell de navegação do KeepSolo com bottom nav mobile-first, header tabs no desktop e identidade visual pessoal (cores quentes, cantos arredondados, espaçamento generoso).

## Escopo

### Telas / Componentes
- **Bottom nav**: 3 ícones — Eye (Monitor), Pen (Create), Robot (Agents)
- **Header desktop**: tabs horizontais para navegação (breakpoint ≥ 1024px)
- **Layout**: área de conteúdo full-width, padding generoso
- **Páginas placeholder**: cada rota renderiza título + dados mock estáticos

### Rotas
```
/monitor     → Monitor / Dashboard (placeholder)
/create      → Criar conteúdo (placeholder)
/create/calendar → Calendário (placeholder)
/agents      → Meu Agente (placeholder)
/agents/chat → Chat (placeholder)
/agents/tools→ Ferramentas (placeholder)
/config      → Configurações (placeholder)
```

### Identidade Visual
- Paleta: amber/orange (cores quentes)
- Border radius: 12-16px (rounded-xl)
- Padding: 16-24px (espaçamento generoso)
- Font: system sans-serif
- Ícones: Phosphor duotone
- Sensação: pessoal, friendly, direto

## Features

1. **F-003-A**: Bottom nav — 3 ícones com labels, ativo destacado com cor quente, 48px touch target
2. **F-003-B**: Header tabs desktop — navegação horizontal para telas ≥ 1024px
3. **F-003-C**: Configuração de rotas — react-router-dom com nested routes
4. **F-003-D**: Páginas placeholder — cada rota renderiza componente com dados mock em cards arredondados
5. **F-003-E**: Tokens de design KeepSolo — variáveis CSS / classes Tailwind para paleta quente

## Limites

- NÃO implementar funcionalidades dos rooms (→ PRP-004 a PRP-012)
- NÃO implementar dark mode (→ PRP-014)
- Placeholders usam dados mock sem interatividade

## Dependências

- **PRP-001** — scaffold, i18n e dados mock devem existir
