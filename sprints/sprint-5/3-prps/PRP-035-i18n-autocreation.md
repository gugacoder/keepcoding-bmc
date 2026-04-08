# PRP-035 — i18n Autocriação

**Passada:** 5 — Autocriação
**Specs:** S-041
**Discoveries:** D-057
**Prioridade:** 7

---

## Objetivo

Internacionalizar todas as strings de UI introduzidas nas features de autocriação (PRP-029 a PRP-034). Os 3 locales do projeto (pt, en, es) devem cobrir toda a nova UX. Sem este PRP, a seção de autocriação fica em português hardcoded enquanto o resto do app é multilíngue.

## Escopo

### Strings a Traduzir

Adicionar nas 3 locales de cada app (`src/i18n/locales/{pt,en,es}.json`), namespace `autocreation`:

| Chave | pt (default) | en | es |
|-------|-------------|----|----|
| `suggestions.title` | Sugestões para você | Suggestions for you | Sugerencias para ti |
| `suggestions.titleBiz` | Sugestões da IA | AI Suggestions | Sugerencias de la IA |
| `suggestions.badge` | IA | AI | IA |
| `suggestions.new` | {{count}} novas | {{count}} new | {{count}} nuevas |
| `suggestions.pending` | {{count}} pendentes | {{count}} pending | {{count}} pendientes |
| `actions.approve` | Aprovar | Approve | Aprobar |
| `actions.edit` | Editar sugestão | Edit suggestion | Editar sugerencia |
| `actions.reject` | Rejeitar | Reject | Rechazar |
| `actions.undo` | Desfazer | Undo | Deshacer |
| `toast.approved` | Sugestão aprovada! | Suggestion approved! | ¡Sugerencia aprobada! |
| `toast.edited` | Sugestão editada e aprovada! | Suggestion edited and approved! | ¡Sugerencia editada y aprobada! |
| `toast.rejected` | Sugestão rejeitada | Suggestion rejected | Sugerencia rechazada |
| `campaign.title` | Campanha proposta | Proposed campaign | Campaña propuesta |
| `campaign.accept` | Aceitar campanha | Accept campaign | Aceptar campaña |
| `campaign.customize` | Personalizar | Customize | Personalizar |
| `campaign.dismiss` | Dispensar | Dismiss | Descartar |
| `campaign.accepted` | Campanha aceita! {{count}} posts criados. | Campaign accepted! {{count}} posts created. | ¡Campaña aceptada! {{count}} posts creados. |
| `campaign.postsPlanned` | {{count}} posts planejados | {{count}} posts planned | {{count}} posts planificados |
| `activity.agentCreated` | Agente criou {{count}} sugestões | Agent created {{count}} suggestions | El agente creó {{count}} sugerencias |
| `calendar.legend.confirmed` | Conteúdo confirmado | Confirmed content | Contenido confirmado |
| `calendar.legend.aiPending` | Sugestão da IA (aguardando aprovação) | AI suggestion (awaiting approval) | Sugerencia de IA (pendiente de aprobación) |
| `divider.yourContent` | Seu conteúdo | Your content | Tu contenido |
| `divider.existingContent` | Conteúdo existente | Existing content | Contenido existente |
| `monitor.insightTitle` | Baseado no seu desempenho recente | Based on your recent performance | Basado en tu desempeño reciente |
| `monitor.viewSuggestions` | Ver sugestões de conteúdo | View content suggestions | Ver sugerencias de contenido |

### Regras de Implementação

- Seguir a estrutura de i18n já existente nos apps (checar se flat ou aninhado)
- Usar interpolação `{{count}}` para pluralização simples
- Todas as telas de autocriação (PRP-029 a PRP-034) devem usar chaves i18n, sem strings hardcoded

## Features

1. **F-035-A**: Strings de autocriação nos 3 locales do KeepSolo (`src/i18n/locales/{pt,en,es}.json`)
2. **F-035-B**: Strings de autocriação nos 3 locales do KeepBiz (`src/i18n/locales/{pt,en,es}.json`)
3. **F-035-C**: Substituir strings hardcoded por chaves i18n em todos os componentes de autocriação de ambos os apps

## Limites

- NÃO alterar strings existentes de sprints anteriores
- NÃO criar novo setup de i18n — usar o existente
- Namespace ou prefixo `autocreation.*` consistente em ambos os apps

## Dependências

- **PRP-029** — componentes KeepSolo devem existir para substituir strings
- **PRP-030** — componentes KeepBiz devem existir
- **PRP-031** — componentes de campanha devem existir
- **PRP-032** — indicadores visuais devem existir
- **PRP-033** — calendário diferenciado deve existir
- **PRP-034** — insight card deve existir
