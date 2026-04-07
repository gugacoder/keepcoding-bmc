# S-005 — Pipeline de Deploy + Animação de Heartbeat

**Discoveries:** D-006, D-009
**Passada:** 2 (Zona 3 — Agentes & Operações)
**Prioridade:** 10 (coração da narrativa)
**Depende de:** S-001, S-004

---

## Objetivo

Implementar o pipeline de deploy no detail panel do workflow — o stepper visual que leva um workflow de "mapeado" até "agente ativo". Inclui a animação especial de ativação do heartbeat, o momento clímax do demo. Ao ativar o heartbeat, o agente aparece automaticamente na lista de agentes.

---

## Pipeline States

```
mapeado → app em criação → app pronto → implantado → agente treinando → agente ativo
```

### Stepper Visual

Stepper horizontal no detail panel do workflow (`/agents/workflows/:id`):

```
● Mapeado ──── ● App ──── ● Implantado ──── ● Treinando ──── ● Ativo
               Pronto
```

- Cada step é um círculo com label
- Steps completos: preenchidos (cor primária) + linha conectando
- Step atual: anel pulsante
- Steps futuros: cinza/outline

### Ações por Estado

| Estado Atual | Botão Visível | Delay Simulado | Próximo Estado |
|---|---|---|---|
| `mapeado` | "Gerar App" | 2s → `app em criação` → +3s → `app pronto` | `app pronto` |
| `app pronto` | "Implantar" | 1s | `implantado` |
| `implantado` | "Iniciar Treinamento" | 2s | `agente treinando` |
| `agente treinando` | (automático, barra avança) | Barra 0→100% em ~5s | `agente pronto` |
| `agente pronto` | "Ativar Heartbeat" | Animação especial | `agente ativo` |

### Comportamento dos Delays

- Durante delay: botão disabled + loading spinner
- Estado intermediário `app em criação`: mostrar skeleton/loading no stepper
- Barra de treinamento: progress bar animada de 0% a 100% em ~5 segundos, com incrementos visuais

---

## Animação de Heartbeat (Momento Clímax)

Ao clicar "Ativar Heartbeat":

1. **Pulse crescente** (0.5s): 3 rings concêntricos expandindo do centro do ícone de heartbeat
   - Ring 1: scale 1→1.5, opacity 1→0
   - Ring 2: scale 1→2.0, opacity 0.8→0 (delay 0.1s)
   - Ring 3: scale 1→2.5, opacity 0.6→0 (delay 0.2s)

2. **Flash de cor** (0.3s): o card inteiro recebe um flash de verde (KeepBiz) ou amber (KeepSolo)

3. **Confetti burst** (1.5s): partículas coloridas no viewport (pode usar lib `canvas-confetti` ou CSS puro)

4. **Settle** (0.5s): heartbeat fica pulsando continuamente (2 rings suaves, loop infinito)

### CSS do Heartbeat Pulsante (estado contínuo após ativação)

```css
@keyframes heartbeat-pulse {
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.4); opacity: 0; }
  100% { transform: scale(1.8); opacity: 0; }
}

.heartbeat-ring {
  animation: heartbeat-pulse 2s ease-out infinite;
}
.heartbeat-ring:nth-child(2) {
  animation-delay: 0.5s;
}
```

---

## Detail Panel do Workflow

Página `/agents/workflows/:id`:

### Header
- Nome do workflow
- Badge de departamento (KeepBiz)
- Badge de status atual
- Data de criação

### Seção: Pipeline
- Stepper visual horizontal (descrito acima)
- Botão de ação correspondente ao estado atual
- Loading indicators durante delays

### Seção: Informações
- Descrição do workflow (texto do wizard)
- Ferramentas associadas (ícones dos conectores)
- Agente associado (link, se existir)

---

## Integração com Agentes

Quando o workflow atinge `agente ativo`:

1. Um novo agente é criado no state de agentes (se não existia)
2. O agente recebe:
   - `name`: derivado do nome do workflow
   - `role`: derivado da descrição
   - `department`: do workflow (KeepBiz)
   - `status`: `working`
   - `heartbeat`: `true`
   - `trainingProgress`: 100
3. O workflow.agentId é atualizado para apontar para o novo agente
4. Na lista de agentes, o novo agente aparece com heartbeat pulsante

---

## Critérios de Aceite

1. [ ] Detail panel do workflow mostra stepper horizontal com todos os estados
2. [ ] Botão "Gerar App" funciona com delay simulado (2s + 3s)
3. [ ] Botão "Implantar" funciona com delay simulado (1s)
4. [ ] Botão "Iniciar Treinamento" funciona com delay simulado (2s)
5. [ ] Barra de treinamento avança automaticamente de 0% a 100%
6. [ ] Botão "Ativar Heartbeat" dispara animação com 3 rings + flash + confetti
7. [ ] Após ativação, heartbeat pulsa continuamente (loop infinito)
8. [ ] Ao atingir "agente ativo", novo agente aparece na lista de agentes
9. [ ] Loading indicators durante todos os delays simulados
10. [ ] Stepper atualiza visualmente a cada transição de estado
11. [ ] Workflow inicial com status "agente ativo" (da mock data) mostra stepper completo
12. [ ] Pipeline funciona tanto no KeepBiz quanto no KeepSolo
