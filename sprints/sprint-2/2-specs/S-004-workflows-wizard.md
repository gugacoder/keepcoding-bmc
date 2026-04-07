# S-004 — Workflows: Lista + Wizard de Mapeamento

**Discoveries:** D-007
**Passada:** 2 (Zona 3 — Agentes & Operações)
**Prioridade:** 9
**Depende de:** S-001, S-002 (KeepBiz), S-003 (KeepSolo)

---

## Objetivo

Implementar a lista de workflows e o wizard de mapeamento em ambos os apps. É o ponto de entrada da jornada principal — o cliente mapeia um workflow do seu negócio, e o sistema cria o wrapper app. Ao finalizar o wizard, um novo workflow aparece na lista com status "mapeado".

---

## Lista de Workflows

### KeepBiz (`/agents/workflows`)

Tabela/lista com colunas:
| Coluna | Tipo |
|---|---|
| Nome | string |
| Departamento | badge (RH, Financeiro, Operações, Marketing, Atendimento) |
| Status | badge colorido (ver pipeline states) |
| Agente | nome do agente associado (se houver) |
| Data | data de criação formatada |

- Click na linha abre detail page (`/agents/workflows/:id`) com pipeline de deploy (ver S-005)
- Botão "Novo Workflow" no header da lista abre o wizard
- Ordenação por data (mais recente primeiro)

### KeepSolo (`/agents/workflows`)

Lista simplificada (cards):
| Campo | Tipo |
|---|---|
| Nome | string |
| Status | badge colorido |
| Data | data formatada |

- Sem coluna de departamento
- Click no card abre detail

---

## Wizard de Mapeamento

### KeepBiz — 4 Etapas (`/agents/workflows/new`)

**Step 1 — Descrever:**
- Textarea grande (min 4 linhas) com placeholder: "Descreva o que o pessoal faz no dia a dia nesse processo..."
- Ícone de microfone (Phosphor `Microphone`) decorativo ao lado do textarea — não funcional, só visual para reforçar conceito voice-first
- Label: "Conte-nos sobre o workflow"

**Step 2 — Departamento:**
- Select com opções: RH, Financeiro, Operações, Marketing, Atendimento
- Label: "Qual departamento é responsável?"

**Step 3 — Ferramentas:**
- Multi-select/checkbox list dos conectores configurados (dados de `data/connectors.ts`)
- Mostra apenas conectores com `connected: true`
- Label: "Quais ferramentas o pessoal usa nesse processo?"

**Step 4 — Confirmar:**
- Resumo do que foi preenchido (descrição truncada, departamento, ferramentas selecionadas)
- Botão "Criar Workflow" (primary, destaque)
- Botão "Voltar" para editar

### KeepSolo — 3 Etapas (`/agents/workflows/new`)

**Step 1 — Descrever:**
- Textarea com placeholder: "O que você faz repetidamente no seu negócio?"
- Ícone de microfone decorativo

**Step 2 — Ferramentas:**
- Multi-select simplificado (checkboxes)
- Label: "Quais ferramentas você usa?"

**Step 3 — Confirmar:**
- Resumo + "Criar"

### Comportamento Comum

- Stepper visual no topo mostrando progresso (etapa atual highlighted)
- Botões "Próximo" e "Voltar" em cada etapa
- Validação: Step 1 exige texto (min 10 chars), Step 2 (KeepBiz) exige seleção
- Ao clicar "Criar Workflow":
  1. Novo workflow é adicionado ao state local com status `mapeado`
  2. Redirect para a lista de workflows
  3. Novo workflow aparece no topo da lista

---

## State Management

O state dos workflows deve ser gerenciado via React state (useState/useReducer no contexto do app). Os dados iniciais vêm de `data/workflows.ts`, mas novos workflows são adicionados ao state local durante a sessão.

```ts
// Hook sugerido
function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows)

  const addWorkflow = (data: NewWorkflowData) => {
    const workflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: data.description.substring(0, 50),
      department: data.department,
      status: 'mapeado',
      createdAt: new Date().toISOString(),
    }
    setWorkflows(prev => [workflow, ...prev])
    return workflow
  }

  const updateWorkflowStatus = (id: string, status: Workflow['status']) => { ... }

  return { workflows, addWorkflow, updateWorkflowStatus }
}
```

Contexto React (`WorkflowContext`) para compartilhar entre lista, wizard, e pipeline.

---

## Critérios de Aceite

1. [ ] Lista de workflows renderiza com dados mock em ambos os apps
2. [ ] KeepBiz mostra colunas: nome, departamento, status, agente, data
3. [ ] KeepSolo mostra cards: nome, status, data (sem departamento)
4. [ ] Click em workflow abre detail page
5. [ ] Botão "Novo Workflow" abre wizard
6. [ ] KeepBiz wizard tem 4 etapas funcionais com stepper visual
7. [ ] KeepSolo wizard tem 3 etapas funcionais
8. [ ] Ícone de microfone decorativo presente no step de descrição
9. [ ] Validação impede avançar sem preencher campos obrigatórios
10. [ ] Ao confirmar, novo workflow aparece na lista com status "mapeado"
11. [ ] Stepper visual mostra progresso correto
12. [ ] Ferramentas no wizard vêm dos conectores configurados
