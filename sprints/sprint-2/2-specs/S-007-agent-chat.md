# S-007 — Chat com Agentes

**Discoveries:** D-011
**Passada:** 2 (Zona 3 — Agentes & Operações)
**Prioridade:** 8
**Depende de:** S-001, S-006

---

## Objetivo

Implementar interface de chat funcional para interação direta com agentes. O chat demonstra que cada agente tem personalidade e conhecimento contextual do negócio. Respostas vêm de um pool pré-definido por agente (não genéricas).

---

## KeepBiz: Chat (`/agents/chat`)

### Layout Desktop (>= 1024px)

```
┌────────────────┬───────────────────────────────┬──────────────┐
│ Agent Selector │     Chat Area                 │ Context Panel│
│                │                               │              │
│ ● Invoice H.  │  Agent: Invoice Hunter         │ Memória:     │
│   Lead Nurt.  │  ────────────────              │ - item 1     │
│   Schedule K. │  [Agent] Olá! Como posso...    │ - item 2     │
│   Content D.  │                                │              │
│                │  [You] Qual status das faturas?│ Status:      │
│                │                                │ Working ●    │
│                │  [Agent] typing...             │              │
│                │                                │ Treinamento: │
│                │  ─────────────────────         │ 100%         │
│                │  [Input message...]  [Send]    │              │
└────────────────┴───────────────────────────────┴──────────────┘
```

### Layout Mobile

- Seletor de agente: dropdown no header do chat
- Sem context panel (mobile não tem espaço)
- Chat area full width

### Seletor de Agente

- Lista lateral (desktop) ou dropdown (mobile)
- Mostra nome, role, status badge, heartbeat indicator
- Click seleciona o agente e carrega conversa
- Se navegou de `/agents/:id` com "Conversar", agente pré-selecionado

### Context Panel (desktop only)

- Memória do agente (resumo: 3-4 itens mais recentes)
- Status atual (badge)
- Último treinamento (data mock)
- Barra de progresso de treinamento

---

## KeepSolo: Chat (`/agents/chat`)

### Layout

- Sem seletor de agente — é sempre "Meu Assistente"
- Chat area full width
- Header: avatar + nome + status

```
┌──────────────────────────────┐
│ 🤖 Meu Assistente  ● Working│
├──────────────────────────────┤
│                              │
│  [Agent] Oi! No que posso... │
│                              │
│  [You] Como estão meus leads?│
│                              │
│  [Agent] ●●● (typing...)    │
│                              │
│  ─────────────────────       │
│  [Input message...]  [Send]  │
└──────────────────────────────┘
```

---

## Comportamento do Chat

### Envio de Mensagem
1. Usuário digita no input (textarea single-line, expandível)
2. Envio via click no botão Send (ícone PaperPlaneRight) OU tecla Enter
3. Mensagem do usuário aparece imediatamente no chat (bolha direita, cor primária)
4. Input limpa após envio
5. Indicador "digitando..." aparece (bolha esquerda com animação de 3 dots)
6. Após delay de 1-2s (random), resposta do agente aparece (bolha esquerda)
7. Scroll automático para última mensagem

### Pool de Respostas

Cada agente em `data/agents.ts` tem `chatResponses: string[]` com 5-8 respostas contextuais.

A seleção da resposta deve ser pseudo-contextual: se a mensagem do usuário contém palavras-chave, selecionar resposta mais relevante. Caso contrário, selecionar aleatoriamente do pool.

**Exemplo — Invoice Hunter:**
```ts
chatResponses: [
  "Verifiquei as faturas de hoje: 3 pendentes de aprovação, 2 em processamento. Quer que eu priorize alguma?",
  "A conciliação bancária desta semana está 85% completa. Restam 12 lançamentos para conferir.",
  "Encontrei uma fatura duplicada do fornecedor TechParts — R$ 4.200,00. Bloquei o pagamento automaticamente.",
  "O relatório de contas a pagar está pronto. Envio por email ou prefere visualizar aqui?",
  "Detectei que o fornecedor ABC não enviou a NF do pedido #1847. Já enviei o lembrete.",
  "As faturas vencendo esta semana totalizam R$ 23.500,00. Todas dentro do limite aprovado.",
  "Preciso da sua confirmação para processar o pagamento de R$ 12.000,00 para DataSys. Aprovar?",
  "O fluxo de caixa previsto para os próximos 7 dias está positivo em R$ 45.000,00."
]
```

**Exemplo — Meu Assistente (KeepSolo):**
```ts
chatResponses: [
  "Seus leads desta semana: 3 novos contatos, 1 converteu para cliente. Quer ver os detalhes?",
  "Notei que você tem 2 follow-ups pendentes de ontem. Posso enviar agora?",
  "O post do Instagram que agendamos teve 240 views até agora — 15% acima da média.",
  "Tenho uma sugestão: seus melhores horários de engajamento são terça e quinta às 19h.",
  "A cobrança do cliente Silva já foi enviada. Ele abriu o email mas ainda não respondeu.",
  "Seu funil está saudável: 45 visitantes → 12 leads → 4 contatos → 2 clientes este mês.",
  "Preciso de um input seu: o lead Maria Oliveira pediu um orçamento personalizado. Quer que eu envie o padrão ou prefere revisar?",
  "Resumo da semana: 5 posts publicados, 3 novos leads, R$ 2.300 em vendas confirmadas."
]
```

### Bolhas de Chat

- **Usuário**: alinhada à direita, background cor primária (blue-600 KeepBiz / amber-500 KeepSolo), texto branco
- **Agente**: alinhada à esquerda, background sutil (slate-100 / neutral-100), texto escuro
- Avatar do agente: ícone ou iniciais em círculo
- Timestamp discreto abaixo de cada bolha

### Indicador "digitando..."

3 dots animados em bouncing sequence:
```css
@keyframes typing-dot {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}
```

---

## State

Conversas são mantidas em state local por agente. Persistem durante a sessão (navegação entre páginas não perde histórico). Cada conversa inicia com uma mensagem de boas-vindas do agente.

```ts
interface ChatMessage {
  id: string
  agentId: string
  sender: 'user' | 'agent'
  text: string
  timestamp: string
}
```

---

## Critérios de Aceite

1. [ ] KeepBiz: seletor de agente funciona (lista lateral no desktop, dropdown no mobile)
2. [ ] KeepBiz: context panel mostra memória, status e treinamento do agente selecionado
3. [ ] KeepSolo: chat direto com "Meu Assistente" (sem seletor)
4. [ ] Envio por Enter e por click no botão Send
5. [ ] Mensagem do usuário aparece imediatamente como bolha direita
6. [ ] Input limpa após envio
7. [ ] Indicador "digitando..." com animação aparece por 1-2s
8. [ ] Resposta do agente aparece como bolha esquerda após o delay
9. [ ] Respostas são contextuais ao agente (não genéricas)
10. [ ] Scroll automático para última mensagem
11. [ ] Bolhas diferenciadas visualmente (user vs agent)
12. [ ] Navegação de "Conversar" no detail de agente pré-seleciona o agente correto
