# PRP-007 — Chat com Agentes

**Passada:** 2 — Zona 3: Agentes & Operações
**Specs:** S-007
**Discoveries:** D-011
**Prioridade:** 8

---

## Objetivo

Implementar a interface de chat com agentes em ambos os apps, com respostas contextuais por role de agente, indicador de "digitando..." e layout adaptado (KeepBiz: 3 colunas no desktop; KeepSolo: chat direto full-width).

## Escopo

### KeepBiz — Chat (`/agents/chat`)
- **Desktop (≥1024px)**: 3 colunas — seletor de agente | área de chat | painel de contexto (memória, status, último treinamento)
- **Mobile**: dropdown seletor + chat full-width
- **Pool de respostas**: 5-8 respostas contextuais **por agente** (variam por role)

### KeepSolo — Chat (`/agents/chat`)
- **Layout**: chat full-width, sem seletor (sempre "Meu Assistente")
- **Pool de respostas**: 5-8 respostas que variam conforme keywords do input

### Mecânica (ambos)
- Input conectado ao state, envio por click ou Enter
- Mensagem do usuário aparece imediatamente (bolha direita)
- Indicador "digitando..." com 3 dots animados (1-2s delay)
- Resposta do agente aparece (bolha esquerda) — selecionada do pool
- Scroll automático para última mensagem
- Limpar input após envio
- Bolhas diferenciadas visualmente (cor, alinhamento)

## Features

1. **F-007-A**: Layout chat KeepBiz desktop — 3 colunas com seletor, chat central, painel contexto
2. **F-007-B**: Layout chat KeepBiz mobile — dropdown seletor + chat full-width
3. **F-007-C**: Layout chat KeepSolo — chat full-width com avatar "Meu Assistente"
4. **F-007-D**: Mecânica de envio — input, Enter/click, limpar, bolhas user/agent, scroll automático
5. **F-007-E**: Indicador "digitando..." — 3 dots animados, delay 1-2s antes da resposta
6. **F-007-F**: Pool de respostas contextuais — arquivo de respostas por agente/role, seleção baseada em keywords ou round-robin
7. **F-007-G**: Painel de contexto (KeepBiz desktop) — exibe memória, status e último treinamento do agente selecionado

## Limites

- NÃO integrar com API real — respostas são de um pool estático
- NÃO implementar histórico persistente — conversa existe apenas na sessão
- NÃO implementar envio de arquivos ou mídia

## Dependências

- **PRP-006** — lista de agentes e dados de memória (painel de contexto)
- **PRP-001** — dados mock (pool de respostas)
