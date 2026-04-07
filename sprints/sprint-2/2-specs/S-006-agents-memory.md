# S-006 — Agentes: Lista, Detail Panel e Memória

**Discoveries:** D-008, D-010
**Passada:** 2 (Zona 3 — Agentes & Operações)
**Prioridade:** 9
**Depende de:** S-001, S-002/S-003, S-005

---

## Objetivo

Implementar a lista de agentes, detail panel completo e sistema de memória em ambos os apps. Demonstrar o estado pós-pipeline: agentes ativos com identidade própria, controláveis pelo usuário, com memória visível e editável.

---

## KeepBiz: Agent Core

### Lista de Agentes (`/agents`)

Tabela/grid com dados de `data/agents.ts`:

| Coluna | Tipo |
|---|---|
| Heartbeat | Indicador visual (pulsante se ativo, cinza se inativo) |
| Nome | string com ícone de avatar |
| Role | string (ex: "Invoice Hunter") |
| Departamento | badge |
| Status | badge (Idle=cinza, Working=green, Waiting=amber) |

- Click na linha abre detail panel (`/agents/:id`)
- Heartbeat pulsante: 2 rings animados (CSS animation, loop) — mesmo estilo do S-005
- Ordenação: agentes com heartbeat ativo primeiro

### Detail Panel (`/agents/:id`)

Layout em abas ou seções empilhadas:

**1. Status & Controle**
- Status badge grande (Idle/Working/Waiting on data)
- Heartbeat visual
- Botão Play/Pause:
  - Click abre Dialog de confirmação: "Tem certeza que deseja pausar/retomar o agente {nome}?"
  - Confirmar → toggle status entre `working` e `idle`
  - Cancel → fecha dialog

**2. Atividades (Timeline)**
- Lista cronológica das ações recentes do agente (`data/agents.ts → activities`)
- Cada item: ícone de resultado (check/warning/x), descrição da ação, timestamp
- Scroll vertical se muitos itens

**3. Treinamento**
- Barra de progresso: `trainingProgress` (0-100%)
- Label: "{progress}% treinado"
- Botão "Refinar via chat" → navega para `/agents/chat/:agentId`

**4. Memória** (ver seção Memória abaixo)

**5. Ações**
- "Conversar" → navega para `/agents/chat/:agentId`
- Auto-prompt ao criar agente (via pipeline): Dialog "Standalone bot or wrap in app?" com duas opções visuais — decorativo, apenas visual

---

## KeepSolo: Meu Agente

### Página "Meu Agente" (`/agents`)

Card único (ou poucos) estilo dashboard:

```
┌─────────────────────────────────┐
│  🤖 Meu Assistente              │
│  Status: Working  ● heartbeat   │
│                                 │
│  [Pausar]  [Conversar]          │
│                                 │
│  Treinamento: ████████░░ 90%    │
│                                 │
│  ▸ Memória (expandir)           │
│  ▸ Hints (expandir)             │
└─────────────────────────────────┘
```

- **Pause/Resume**: direto no card, SEM dialog de confirmação (diferente do KeepBiz)
- **Conversar**: navega para `/agents/chat`
- **Treinamento**: barra de progresso inline
- **Memória**: seção expansível (Accordion ou Collapsible)
- **Hints**: seção de sugestões autônomas do agente
  - Lista de strings sugeridas: "Notei que você faz X toda segunda — quer que eu assuma?"
  - Botões "Aceitar" / "Ignorar" por hint
  - Dados mock: 2-3 hints pré-definidos

---

## Memória do Agente (Comum)

Presente tanto no detail do KeepBiz quanto na seção expansível do KeepSolo.

### Layout

Agrupada por categoria (Accordion ou tabs):
- **Operações** — ex: "Envia relatório financeiro toda sexta às 17h"
- **Preferências** — ex: "Preferência: contato por WhatsApp antes de email"
- **Regras** — ex: "Nunca aprovar pagamento acima de R$ 5.000 sem confirmação"

Cada item:
```
┌──────────────────────────────────────────┐
│ Envia relatório financeiro toda sexta... │  [X]
└──────────────────────────────────────────┘
```

- **Remover (X)**: Dialog de confirmação → "Remover este item da memória?" → Confirmar remove do state
- **"Ensinar algo novo"**: botão no rodapé da seção
  - Click abre: textarea + select de categoria + botão "Salvar"
  - Ao salvar: novo item aparece na categoria selecionada, textarea limpa

### Dados Mock de Memória (por agente)

**Invoice Hunter:**
- Operações: "Processa faturas de fornecedores toda terça e quinta"
- Operações: "Envia relatório de pagamentos pendentes na sexta"
- Preferências: "Formato de relatório: PDF com tabela resumo"
- Regras: "Não aprovar pagamento acima de R$ 10.000 sem autorização do financeiro"

**Lead Nurturer:**
- Operações: "Follow-up automático 48h após primeiro contato"
- Preferências: "Tom amigável e pessoal nos emails"
- Regras: "Não enviar mais que 3 emails por semana por lead"

(Demais agentes seguem padrão similar)

---

## Critérios de Aceite

1. [ ] KeepBiz: lista de agentes renderiza com heartbeat, nome, role, departamento, status
2. [ ] KeepBiz: heartbeat pulsante animado para agentes ativos
3. [ ] KeepBiz: click em agente abre detail panel com todas as seções
4. [ ] KeepBiz: Play/Pause com Dialog de confirmação funciona
5. [ ] KeepBiz: timeline de atividades renderiza cronologicamente
6. [ ] KeepBiz: barra de treinamento mostra progresso correto
7. [ ] KeepSolo: card "Meu Agente" renderiza com status, heartbeat, controles
8. [ ] KeepSolo: Pause/Resume direto (sem dialog)
9. [ ] KeepSolo: seção de Hints com botões Aceitar/Ignorar
10. [ ] Memória: itens agrupados por categoria em ambos os apps
11. [ ] Memória: remover item (X) com confirmação funciona
12. [ ] Memória: "Ensinar algo novo" → textarea + categoria → item aparece na lista
13. [ ] Navegação "Conversar" redireciona para chat com agente correto
