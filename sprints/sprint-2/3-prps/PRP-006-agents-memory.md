# PRP-006 — Agentes: Lista, Detail Panel & Memória

**Passada:** 2 — Zona 3: Agentes & Operações
**Specs:** S-006
**Discoveries:** D-008, D-010
**Prioridade:** 9

---

## Objetivo

Implementar a lista de agentes, detail panel com status/controles/timeline e sistema de memória do agente em ambos os apps. Demonstra o estado pós-pipeline: agentes ativos com identidade, controle humano e capacidade de aprendizado.

## Escopo

### KeepBiz — Agent Core (`/agents`)
- **Lista/tabela de agentes**: nome, role, departamento, status (Idle/Working/Waiting on data), heartbeat visual
- **Detail panel** ao clicar:
  - Status & Controle: Play/Pause com Dialog de confirmação
  - Atividades: timeline do que o agente fez recentemente
  - Treinamento: barra de progresso + botão "Refinar via chat"
  - Memória: itens por categoria com add/remove
  - Botão "Conversar" → navega para Chat

### KeepSolo — Meu Agente (`/agents`)
- **Card único** "Meu Assistente" com status, heartbeat, controles diretos (Play/Pause sem dialog)
- **Memória**: seção expansível com itens por categoria
- **Hints**: seção de sugestões autônomas ("Notei que você faz X toda segunda...")

### Memória do Agente (ambos)
- Itens agrupados por categoria: Operações, Preferências, Regras
- Remover item (X) com Dialog de confirmação
- "Ensinar algo novo" → textarea + confirmar → item aparece na categoria selecionada

## Features

1. **F-006-A**: Lista de agentes KeepBiz — tabela com colunas, status badges, heartbeat visual pulsante, filtro por departamento
2. **F-006-B**: Detail panel KeepBiz — Sheet/panel lateral com abas (Status, Atividades, Treinamento, Memória)
3. **F-006-C**: Play/Pause com confirmação — Dialog "Tem certeza?" ao pausar agente ativo
4. **F-006-D**: Timeline de atividades — lista cronológica de ações recentes do agente (dados mock)
5. **F-006-E**: Card "Meu Agente" KeepSolo — card com status, heartbeat, controles diretos, hints
6. **F-006-F**: Memória do agente (ambos) — lista por categoria, add via textarea, remove com confirmação
7. **F-006-G**: Barra de treinamento — progress bar com porcentagem, botão "Refinar via chat" navega para chat

## Limites

- NÃO implementar chat (→ PRP-007)
- NÃO implementar RBAC/permissões (→ PRP-013)
- NÃO implementar auto-prompt "Standalone bot or wrap in app?" (→ PRP-013)
- Dados de atividades e memória são mock estáticos + items adicionados na sessão

## Dependências

- **PRP-001** — dados mock (agentes)
- **PRP-002** / **PRP-003** — shells com rotas
- **PRP-005** — pipeline de deploy cria agentes (integração de state)
