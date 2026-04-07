# KeepBiz -- Apps-Wrapper

> **Conceito central da entrega ao cliente**

---

## O que são

Apps-wrapper são **aplicações leves (desktop + mobile)** geradas automaticamente pela fábrica de Workflows. Elas espelham as tarefas que o pessoal da empresa já faz no dia a dia, mas dentro do nosso ecossistema.

O pessoal usa o app-wrapper em vez de acessar o ERP/CRM diretamente. O app replica todas as ações nos sistemas existentes do cliente.

---

## Função dupla

| Função | Descrição |
|---|---|
| **Interface operacional** | O pessoal faz o trabalho real através do app -- agendar, pagar, registrar, enviar. |
| **Camada de aprendizado** | Cada interação (cliques, inputs, decisões, padrões) é observada por agentes que aprendem a replicar o trabalho. |

> O app-wrapper é o cavalo de troia: canaliza o trabalho pelo nosso sistema para que o agente observe, aprenda, e depois assuma.

---

## Como são construídos

1. **Mapeamento** -- Observamos as tarefas diárias do pessoal (fase piloto: nós fazemos; fase escala: cliente mapeia via dashboard).
2. **Descrição ao agente** -- Explicamos ao agente o que aprendemos do mapeamento.
3. **Geração pelo Workflow** -- O agente solicita à fábrica de Workflows a criação do app.
4. **Deploy** -- O app é instalado nos desktops e mobiles do pessoal.

---

## Integração com sistemas existentes

Os apps-wrapper não substituem ERPs/CRMs. Eles se conectam via:

- **MCP** (Model Context Protocol) -- quando o sistema do cliente expõe MCP servers
- **REST API** -- para integrações padrão
- **Bash / CLI** -- para sistemas legados ou automações locais
- **Outros conectores** -- qualquer coisa que código possa acessar

Tudo que o pessoal faz no app-wrapper é replicado no sistema original. O cliente não perde nada.

---

## Ciclo de vida

```
[App criado] → [Pessoal usa] → [Agente observa] → [Agente aprende] → [Agente assume]
                                                                         ↓
                                                              [Pessoal liberado]
                                                              [Headcount mantido/reduzido]
```

Quando o agente assume uma tarefa, o app-wrapper pode continuar existindo como interface de supervisão -- ou ser desativado se a tarefa for 100% autônoma.

---

## Plataformas de entrega

- **Desktop** (Windows, macOS, Linux)
- **Mobile** (Android, iOS)

Stack definida no projeto: shadcn + Vite para apps mobile, shadcn + Next para websites.

---

## Hipótese crítica (H1)

> "Funcionários de PMEs vão adotar os apps que construímos em vez de mexer diretamente no ERP/CRM que já conhecem."

**Critério de validação:** Nos dois pilotos, pelo menos 80% das tarefas mapeadas passam a ser executadas pelo app-wrapper dentro de 30 dias após o deploy.

Se esta hipótese falhar, os agentes não têm dados para aprender e o loop inteiro para.
