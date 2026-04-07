# S-008 — Conectores

**Discoveries:** D-012
**Passada:** 2 (Zona 3 — Agentes & Operações)
**Prioridade:** 7
**Depende de:** S-001, S-002/S-003

---

## Objetivo

Implementar a tela de conectores (integrações com ferramentas externas) em ambos os apps. Prova que os agentes operam ferramentas reais do cliente — Google Workspace, WhatsApp, ERP via MCP. Sem conectores, o produto parece uma ilha.

---

## KeepBiz: Conectores (`/agents/connectors`)

### Layout

```
┌───────────────────────────────────────────────┐
│ Conectores               [+ Adicionar]        │
│                                               │
│ Filtros: [Todos] [Produtividade] [Comunicação]│
│          [Finanças] [CRM] [Automação]         │
│                                               │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│ │ G.Works │ │ MS 365  │ │ WhatsApp│          │
│ │ ● Ativo │ │ ● Ativo │ │ ● Ativo │          │
│ └─────────┘ └─────────┘ └─────────┘          │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│ │ Slack   │ │ Trello  │ │ERP Proc.│          │
│ │ ○ Inativo│ │ ○ Inativo│ │ ● MCP  │          │
│ └─────────┘ └─────────┘ └─────────┘          │
└───────────────────────────────────────────────┘
```

### Grid de Conectores

Cards em grid responsivo (3 cols desktop, 2 cols tablet, 1 col mobile):

Cada card:
- Ícone do conector (Phosphor icon mapeado no `data/connectors.ts`)
- Nome
- Status: badge "Conectado" (green) ou "Desconectado" (gray)
- Categoria (texto menor, cor sutil)
- Click abre painel de configuração

### Filtros por Categoria (Pills)

- Pills horizontais scrolláveis: Todos, Produtividade, Comunicação, Finanças, CRM, Automação
- "Todos" selecionado por default
- Click filtra o grid — mostra apenas conectores da categoria
- Pills são toggles: click no ativo deseleciona (volta para "Todos")
- Transição suave no grid (fade ou layout shift)

### Botão "Adicionar Conector"

- Abre Dialog/Sheet com catálogo de conectores disponíveis
- Grid com todos os conectores não conectados + conectores "novos" (mock):
  - HubSpot (CRM), Notion (Produtividade), Zapier (Automação), QuickBooks (Finanças)
- Click em conector do catálogo: abre config mock
- Config mock: campos de API key (text input) ou botão "Conectar com OAuth" (decorativo)
- Ao "Salvar": conector aparece no grid principal como "Conectado"

### Painel de Config (conector existente)

- Sheet/Dialog com:
  - Nome e ícone
  - Status badge
  - Campos de configuração mock (API key, OAuth status)
  - Botão "Desconectar" (destructive)
- **Desconectar**: Dialog de confirmação → "Tem certeza? O agente perderá acesso a {nome}." → Confirmar muda status para desconectado

---

## KeepSolo: Minhas Ferramentas (`/agents/tools`)

### Layout Simplificado

Lista vertical (não grid):

```
┌───────────────────────────────────────┐
│ Minhas Ferramentas    [+ Adicionar]   │
│                                       │
│ ┌─────────────────────────────────┐   │
│ │ 🔧 Google Workspace  ● Ativo   │   │
│ └─────────────────────────────────┘   │
│ ┌─────────────────────────────────┐   │
│ │ 💬 WhatsApp Business  ● Ativo  │   │
│ └─────────────────────────────────┘   │
│ ┌─────────────────────────────────┐   │
│ │ 📋 Trello            ○ Inativo │   │
│ └─────────────────────────────────┘   │
└───────────────────────────────────────┘
```

- Sem filtros de categoria (menos complexidade)
- "Adicionar ferramenta": lista simples com opções disponíveis
- Click em ferramenta existente: opção "Desconectar" com confirmação
- Desconectar: Dialog simples "Desconectar {nome}?" → Confirmar

---

## Critérios de Aceite

1. [ ] KeepBiz: grid de conectores renderiza com dados mock
2. [ ] KeepBiz: filtros por categoria (pills) filtram o grid corretamente
3. [ ] KeepBiz: "Adicionar conector" abre catálogo com opções
4. [ ] KeepBiz: config mock com campos de API key / OAuth decorativo
5. [ ] KeepBiz: "Desconectar" com Dialog de confirmação funciona
6. [ ] KeepBiz: ao adicionar conector, ele aparece no grid como "Conectado"
7. [ ] KeepSolo: lista simplificada de "Minhas Ferramentas" renderiza
8. [ ] KeepSolo: "Adicionar ferramenta" mostra opções disponíveis
9. [ ] KeepSolo: "Desconectar" com confirmação funciona
10. [ ] Ícones Phosphor corretos para cada conector
11. [ ] Status badges (Conectado/Desconectado) visuais
