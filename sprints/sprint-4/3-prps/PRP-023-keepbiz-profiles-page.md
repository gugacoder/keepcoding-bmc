# PRP-023 — KeepBiz: Página de Perfis + Navegação

**Passada:** 4 — Perfil
**Specs:** S-025
**Discoveries:** D-038
**Prioridade:** 10

---

## Objetivo

Criar a página de gestão de perfis no KeepBiz (`/profiles`) com grid de cards, ações de CRUD mock e navegação na sidebar. Essa é a porta de entrada para o conceito multi-perfil — o usuário visualiza, cria e gerencia seus perfis a partir daqui.

## Escopo

### Telas / Componentes

- **ProfilesPage** (`src/pages/ProfilesPage.tsx`): grid responsivo de cards de perfil com header e botão de criação
- **ProfileCard** (`src/components/ProfileCard.tsx`): card individual com nome, segmento, status badge, barra de completude, plataformas, data de atualização e ações (Editar, Excluir)

### Rotas

```
/profiles     → ProfilesPage
/profiles/new → ProfileWizardPage (placeholder — implementado no PRP-024)
```

### Navegação — Sidebar

- Seção **"Perfis"** com ícone `UserCircle` (Phosphor), posicionada **acima** das 3 zonas existentes
- Link direto para `/profiles` (sem sub-links)

### ProfileCard — Conteúdo

- Nome do negócio (`identity.businessName`) — título
- Segmento (`niche.segment`) — subtítulo
- Status badge: `ativo` (green), `completo` (blue), `rascunho` (yellow), `inativo` (gray)
- Perfil ativo: borda destacada (blue-500)
- Barra de completude: 0-100% com cor (red < 50, yellow < 80, green >= 80)
- Ícones das plataformas ativas
- "Atualizado há X dias" (relative time)
- Botão "Editar" → `/profiles/new?edit=PRF-XXX`
- Botão "Excluir" → dialog de confirmação → remove do state local

### Empty State

Se array vazio: ícone `UserCirclePlus`, título "Nenhum perfil criado", descrição, CTA "Criar Primeiro Perfil" → `/profiles/new`

## Features

1. **F-023-A**: ProfilesPage com grid responsivo — header com título + botão "Criar Novo Perfil", grid 2 colunas desktop / 1 mobile
2. **F-023-B**: ProfileCard — card com nome, segmento, status badge, barra de completude, plataformas, data relativa
3. **F-023-C**: Ações do card — botão Editar (navega para wizard), botão Excluir (dialog de confirmação + remoção do state local)
4. **F-023-D**: Sidebar — adicionar seção "Perfis" com ícone `UserCircle` acima das 3 zonas existentes
5. **F-023-E**: Empty state — renderizar quando array de perfis está vazio, com CTA para `/profiles/new`
6. **F-023-F**: i18n — strings de ProfilesPage e ProfileCard em pt/en/es

## Limites

- NÃO implementar o wizard de criação/edição (→ PRP-024)
- A rota `/profiles/new` renderiza um placeholder até PRP-024 ser implementado
- Exclusão é local (state), não persiste

## Dependências

- **PRP-022** — tipos `Profile` e mock data `profiles` devem existir
