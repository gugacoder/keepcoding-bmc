# S-028 — KeepBiz: Seletor de Perfil em Criação e Monitor

**Discoveries:** D-041, D-046
**Passada:** 5 (Seletor)
**Prioridade:** 8
**Depende de:** S-024, S-027

---

## Objetivo

Permitir que o usuário KeepBiz alterne entre "Todos os perfis" e um perfil específico nas áreas de Content Forge e Social Monitor. A seleção filtra visualmente o conteúdo (mock: badge do perfil nos cards). Adicionalmente, exibir o perfil ativo na Orchestrator Bar.

---

## Componente Seletor (`src/components/ProfileSelector.tsx`)

```tsx
interface ProfileSelectorProps {
  className?: string
}
```

### Layout

Dropdown ou grupo de tabs no topo da área de conteúdo:

```
┌──────────────────────────────────────────────────────┐
│  [▾ Todos os perfis]  |  Processa Sistemas  |  ...   │
└──────────────────────────────────────────────────────┘
```

- Primeira opção: "Todos os perfis" (valor `null` no `activeProfileId`)
- Uma opção por perfil existente, exibindo `identity.businessName`
- Perfil ativo tem status dot colorido (green para ativo, yellow para rascunho)
- Seleção persiste via `localStorage('keepbiz-active-profile')`
- State gerenciado pelo `ProfileContext` (spec S-027)

### Implementação

Usar componente `Select` do shadcn/radix (já disponível no projeto) ou tabs simples:

- **Desktop**: tab group horizontal (cabe 2-3 perfis + "Todos")
- **Mobile**: dropdown Select (economiza espaço)

---

## Integração nas Páginas

### MonitorPage

Renderizar `<ProfileSelector />` no topo da página, antes do conteúdo.

Quando um perfil específico está selecionado:
- Exibir badge com nome do perfil nos KPIs/menções
- Mock: filtrar menções para exibir apenas as marcadas com aquele `profileId` (adicionar campo `profileId` opcional nos mock data de `mentions.ts`)

Quando "Todos os perfis" está selecionado:
- Comportamento atual (sem filtro)

### ContentPage

Renderizar `<ProfileSelector />` no topo da página, antes do conteúdo.

Quando um perfil específico está selecionado:
- Exibir badge com nome do perfil em cada card de conteúdo
- Mock: filtrar cards para exibir apenas os com `profileId` correspondente (adicionar campo `profileId` opcional nos mock data de `content.ts`)

---

## Orchestrator Bar — Indicação de Perfil Ativo

Modificar `OrchestratorBar.tsx` para exibir o nome do perfil ativo:

```
┌──────────────────────────────────────────────────────────┐
│ Team Status: ● 3/4 active  │  📋 Processa Sistemas      │
└──────────────────────────────────────────────────────────┘
```

- Quando `activeProfileId !== null`: exibir `identity.businessName` do perfil selecionado com ícone `IdentificationBadge` (Phosphor)
- Quando `activeProfileId === null`: exibir "Todos os perfis"
- Texto truncado com ellipsis se exceder espaço disponível
- Transição suave ao trocar de perfil (opacity fade 200ms)

---

## Dados Mock — Atualização

### `data/mentions.ts` (KeepBiz)

Adicionar campo opcional `profileId: string` a cada menção. Distribuir entre 'PRF-001' e 'PRF-002'.

### `data/content.ts` (KeepBiz)

Adicionar campo opcional `profileId: string` a cada item de conteúdo. Distribuir entre 'PRF-001' e 'PRF-002'.

### `data/types.ts` (KeepBiz)

Adicionar `profileId?: string` nas interfaces `Mention` e `ContentItem`.

---

## Critérios de Aceite

1. [ ] Seletor renderiza no topo de `/monitor` e `/content` com opção "Todos" e uma por perfil
2. [ ] Seleção de perfil persiste via localStorage
3. [ ] MonitorPage filtra menções pelo perfil selecionado (mock)
4. [ ] ContentPage filtra conteúdo pelo perfil selecionado (mock)
5. [ ] "Todos os perfis" exibe todos os dados sem filtro
6. [ ] OrchestratorBar exibe nome do perfil ativo
7. [ ] OrchestratorBar exibe "Todos os perfis" quando nenhum filtro ativo
8. [ ] Seletor é tabs no desktop e dropdown no mobile
9. [ ] Dados mock de menções e conteúdo atualizados com campo `profileId`
10. [ ] i18n: strings em pt/en/es
