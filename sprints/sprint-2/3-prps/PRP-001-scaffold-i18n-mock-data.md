# PRP-001 — Scaffold, i18n & Dados Mock

**Passada:** 1 — Scaffold & Navegação
**Specs:** S-001
**Discoveries:** D-001, D-002, D-003
**Prioridade:** 10 (pré-requisito absoluto)

---

## Objetivo

Criar a fundação técnica dos dois projetos mock (KeepBiz e KeepSolo) com scaffold Vite, sistema de i18n em 3 idiomas e dados mock realistas que alimentam todas as telas subsequentes.

## Escopo

### Projetos
- `mocks/keep-biz/` — scaffold completo
- `mocks/keep-solo/` — scaffold completo

### Stack por projeto
- Vite + React 19 + TypeScript 5.x
- Tailwind CSS 4
- shadcn/ui (preset `b43fNjKT2`, template `vite`, flag `--monorepo`)
- Phosphor Icons (duotone)
- react-router-dom 7
- i18next + react-i18next

### i18n
- 3 locales: `pt` (default), `en`, `es`
- Arquivos de tradução por namespace em `src/locales/{locale}/`
- Provider configurado no App root
- Seletor de idioma funcional (componente reutilizável)

### Dados Mock (`data/`)
Cada app terá arquivos TypeScript em `src/data/` com entidades tipadas:

| Entidade | KeepBiz | KeepSolo |
|----------|---------|----------|
| Workflows | 5 (com departamento) | 3 (sem departamento) |
| Agentes | 4 (roles variados) | 1 ("Meu Assistente") |
| Conectores | 6 (3 conectados, 3 desconectados) | 6 (compartilhados) |
| Conteúdo | 3+ items com status variados | 3+ items |
| Menções | 5-8 (com sentimento) | — |
| Leads | — | 8-10 (com funil) |
| Equipe | 4-5 membros (com roles) | — |
| Audit log | 10-15 entradas | — |

## Features

1. **F-001-A**: Scaffold KeepBiz — `npx shadcn@latest init`, estrutura de pastas `src/`, `src/data/`, `src/locales/`, `src/components/`, `src/pages/`, `src/lib/`
2. **F-001-B**: Scaffold KeepSolo — idem, projeto independente
3. **F-001-C**: Configurar i18n em ambos os projetos — Provider, namespaces, arquivos base (pt/en/es), seletor de idioma
4. **F-001-D**: Dados mock KeepBiz — todos os arquivos `src/data/*.ts` com tipos e entidades realistas
5. **F-001-E**: Dados mock KeepSolo — todos os arquivos `src/data/*.ts` com tipos e entidades realistas
6. **F-001-F**: Verificar que ambos os projetos compilam e renderizam página inicial com seletor de idioma funcional

## Limites

- NÃO implementar navegação, rotas ou layout (→ PRP-002, PRP-003)
- NÃO implementar componentes de UI além do seletor de idioma
- NÃO gerar assets visuais com OpenAI (→ PRP-014)
- Dados mock permanecem no idioma original (nomes de empresas, leads etc. não são traduzidos)

## Dependências

Nenhuma — este é o PRP raiz.
