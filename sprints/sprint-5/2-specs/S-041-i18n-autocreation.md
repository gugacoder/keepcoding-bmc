# S-041 — i18n para UX de Autocriação

**Discoveries:** D-057
**Passada:** 4 (Completude)
**Prioridade:** 7
**Depende de:** S-033, S-034, S-035, S-037, S-038

---

## Objetivo

Internacionalizar todas as strings de UI introduzidas nas features de autocriação (S-033 a S-040). Os 3 locales do projeto (pt, en, es) devem cobrir toda a nova UX.

---

## Strings a Traduzir

Adicionar nas 3 locales de cada app (`src/i18n/locales/{pt,en,es}.json`):

### Namespace sugerido: `autocreation`

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

---

## Regras

- Seguir a estrutura de i18n já existente nos apps (checar se é flat ou aninhado)
- Usar interpolação `{{count}}` para pluralização simples
- Todas as specs de autocriação (S-033 a S-040, S-042) devem usar essas chaves em vez de strings hardcoded

---

## Critérios de Aceite

1. [ ] Strings adicionadas nos 3 locales de ambos os apps
2. [ ] Namespace ou prefixo consistente (`autocreation.*`)
3. [ ] Todas as novas telas usam chaves i18n, sem strings hardcoded
4. [ ] Interpolação de contagem funcional
5. [ ] Seletor de idioma alterna corretamente os novos textos
