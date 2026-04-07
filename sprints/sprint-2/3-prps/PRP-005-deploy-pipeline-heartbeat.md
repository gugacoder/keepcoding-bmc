# PRP-005 — Pipeline de Deploy & Animação de Heartbeat

**Passada:** 2 — Zona 3: Agentes & Operações
**Specs:** S-005
**Discoveries:** D-006, D-009
**Prioridade:** 10 (coração narrativo do produto)

---

## Objetivo

Implementar o pipeline de deploy no detail panel do workflow — stepper horizontal com progressão de estados via botões, delays simulados e a animação de ativação do heartbeat (clímax do pitch). Ao atingir "agente ativo", cria automaticamente um agente na lista.

## Escopo

### Detail Panel do Workflow
- **Stepper visual horizontal**: 6 estados com indicador de progresso
- **Botões de ação por estado**: cada clique avança o pipeline com delay simulado
- **Integração**: ao final, cria novo agente na lista de agentes

### Estados e Transições

| Estado | Botão | Delay | Efeito visual |
|--------|-------|-------|---------------|
| `mapeado` | "Gerar App" | 2s → 3s | Loading skeleton → transição |
| `app em criação` | (automático) | 3s | Barra de progresso |
| `app pronto` | "Implantar" | 1s | Transição suave |
| `implantado` | "Iniciar Treinamento" | 2s | Barra de progresso animada |
| `agente treinando` | (automático) | barra avança | Progress bar 0→100% |
| `agente pronto` | "Ativar Heartbeat" | — | Animação especial |
| `agente ativo` | — | — | Heartbeat pulsante contínuo |

### Animação de Heartbeat
- 3 anéis concêntricos expandindo (pulse)
- Flash de cor no momento da ativação
- Confetti burst (CSS ou canvas)
- Transição para pulse contínuo (3 rings animados em loop)

## Features

1. **F-005-A**: Detail panel do workflow — abre ao clicar em item da lista, mostra info + stepper
2. **F-005-B**: Stepper visual horizontal — 6 estados com ícones, estado atual destacado, estados completos com check
3. **F-005-C**: Progressão com delays — botões por estado, setTimeout simulando operação, loading states durante transição
4. **F-005-D**: Barra de progresso do treinamento — animação de 0→100% durante estado "agente treinando"
5. **F-005-E**: Animação de heartbeat — 3 rings CSS + confetti + flash ao ativar, pulse contínuo depois
6. **F-005-F**: Criação automática de agente — ao atingir "agente ativo", insere novo agente no state global (ambos apps)

## Limites

- NÃO implementar o detail panel de agentes (→ PRP-006)
- NÃO implementar funcionalidades reais de deploy — tudo é simulado com timers
- Delays são fixos (não configuráveis)

## Dependências

- **PRP-004** — lista de workflows e wizard (o pipeline opera sobre workflows existentes)
- **PRP-001** — dados mock
