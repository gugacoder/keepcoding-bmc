# PRP-004 — Workflows: Lista & Wizard de Mapeamento

**Passada:** 2 — Zona 3: Agentes & Operações
**Specs:** S-004
**Discoveries:** D-007
**Prioridade:** 9

---

## Objetivo

Implementar a lista de workflows e o wizard de mapeamento em ambos os apps, permitindo que o usuário crie novos workflows que aparecem na lista com status "mapeado". Este é o ponto de entrada da jornada principal do produto.

## Escopo

### KeepBiz — Workflows (`/agents` sub-rota ou seção)
- **Lista**: tabela/cards com nome, departamento, status no pipeline, agente associado, data
- **Wizard 4 etapas**: Descrever (textarea + mic decorativo) → Departamento (select) → Ferramentas (multi-select dos conectores) → Confirmar (resumo)
- **Estado**: gerenciado via React Context/useState

### KeepSolo — Workflows (`/agents` sub-rota ou seção)
- **Lista**: cards simplificados com nome, status, data
- **Wizard 3 etapas**: Descrever (textarea) → Ferramentas (multi-select) → Confirmar (resumo)

### Estados do Pipeline
`mapeado` → `app em criação` → `app pronto` → `implantado` → `agente treinando` → `agente ativo`

(Apenas "mapeado" é criado aqui; progressão → PRP-005)

## Features

1. **F-004-A**: Lista de workflows KeepBiz — tabela com colunas (nome, dept, status badge, agente, data), populada com dados mock
2. **F-004-B**: Wizard KeepBiz — Dialog/Sheet com stepper visual de 4 etapas, validação por etapa, ícone de mic decorativo
3. **F-004-C**: Lista de workflows KeepSolo — cards simplificados populados com dados mock
4. **F-004-D**: Wizard KeepSolo — Dialog com stepper de 3 etapas
5. **F-004-E**: State management — Context ou store para workflows, add workflow com status "mapeado" ao finalizar wizard
6. **F-004-F**: Multi-select de ferramentas — usa lista de conectores dos dados mock

## Limites

- NÃO implementar progressão do pipeline além de "mapeado" (→ PRP-005)
- NÃO implementar detail panel do workflow com stepper de deploy (→ PRP-005)
- O ícone de mic é decorativo — não há funcionalidade de voz

## Dependências

- **PRP-001** — dados mock (workflows, conectores)
- **PRP-002** — shell KeepBiz com rotas
- **PRP-003** — shell KeepSolo com rotas
