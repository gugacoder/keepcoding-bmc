# S-025 — KeepBiz: ProfilesPage + Navegação

**Discoveries:** D-038
**Passada:** 2 (Telas)
**Prioridade:** 10
**Depende de:** S-024

---

## Objetivo

Criar a página de gestão de perfis no KeepBiz (`/profiles`), com lista/grid de perfis, ações de CRUD e navegação na sidebar. Essa página é o ponto de entrada para o conceito multi-perfil.

---

## Rota

Adicionar em `App.tsx`, dentro do bloco de rotas protegidas:

```tsx
<Route path="/profiles" element={<ProfilesPage />} />
<Route path="/profiles/new" element={<ProfileWizardPage />} />
```

---

## Navegação — Sidebar

Adicionar seção **Perfis** na `Sidebar.tsx`, posicionada **acima** das 3 zonas existentes (Social Monitor, Content Forge, Agent Core). Usar ícone `UserCircle` (Phosphor). A seção Perfis não tem sub-links — é um link direto para `/profiles`.

---

## Página (`src/pages/ProfilesPage.tsx`)

### Layout

Grid responsivo seguindo o padrão do projeto:

```
┌──────────────────────────────────────────────┐
│  Perfis              [+ Criar Novo Perfil]   │
├──────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐             │
│ │ PRF-001     │  │ PRF-002     │             │
│ │ Processa    │  │ Processa    │             │
│ │ Sistemas    │  │ Academy     │             │
│ │             │  │             │             │
│ │ Tecnologia  │  │ Educação    │             │
│ │ ● Ativo     │  │ ○ Rascunho  │             │
│ │ 100%        │  │ 75%         │             │
│ │             │  │             │             │
│ │ [Editar]    │  │ [Editar]    │             │
│ │ [Excluir]   │  │ [Excluir]   │             │
│ └─────────────┘  └─────────────┘             │
└──────────────────────────────────────────────┘
```

### Card de Perfil (`src/components/ProfileCard.tsx`)

Cada card exibe:

- **Nome do negócio** (`identity.businessName`) — título principal
- **Segmento** (`niche.segment`) — subtítulo em texto secundário
- **Status badge**: `ativo` (green), `completo` (blue), `rascunho` (yellow), `inativo` (gray). Perfil ativo tem borda destacada (blue-500)
- **Barra de completude**: progress bar 0-100% com cor baseada no valor (red < 50, yellow < 80, green >= 80)
- **Plataformas**: ícones pequenos das plataformas ativas (Instagram, LinkedIn, etc.)
- **Data de atualização**: "Atualizado há X dias" (relative time)
- **Ações**:
  - Botão "Editar" → navega para `/profiles/new?edit=PRF-XXX` (reutiliza o wizard em modo edição)
  - Botão "Excluir" → dialog de confirmação com nome do perfil. No mock, remove o card da lista (state local)

### Botão "Criar Novo Perfil"

- Posicionado no header da página, alinhado à direita
- Navega para `/profiles/new` (wizard de criação — spec S-026)
- Ícone `Plus` (Phosphor) + texto

### Empty State

Se não houver perfis (array vazio), renderizar `EmptyState` existente com:
- Ícone: `UserCirclePlus` (Phosphor)
- Título: "Nenhum perfil criado"
- Descrição: "Crie seu primeiro perfil para começar a usar as áreas de Criação e Monitoramento."
- CTA: "Criar Primeiro Perfil" → `/profiles/new`

---

## Critérios de Aceite

1. [ ] Rota `/profiles` acessível e protegida por auth
2. [ ] Sidebar exibe link "Perfis" com ícone `UserCircle` acima das 3 zonas
3. [ ] Grid exibe cards dos 2 perfis mock com nome, segmento, status, completude e plataformas
4. [ ] Perfil ativo tem borda destacada
5. [ ] Botão "Criar Novo Perfil" navega para `/profiles/new`
6. [ ] Botão "Excluir" exibe dialog de confirmação e remove o card (state local)
7. [ ] Empty state renderiza quando array de perfis está vazio
8. [ ] Layout responsivo: 2 colunas no desktop, 1 coluna no mobile
9. [ ] i18n: strings em pt/en/es nos arquivos de tradução
