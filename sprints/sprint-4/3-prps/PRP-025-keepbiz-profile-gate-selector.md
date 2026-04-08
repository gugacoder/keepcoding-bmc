# PRP-025 — KeepBiz: Profile Gate, Seletor e Orchestrator Bar

**Passada:** 4 — Perfil
**Specs:** S-027, S-028
**Discoveries:** D-040, D-041, D-046
**Prioridade:** 9

---

## Objetivo

Implementar o ProfileContext compartilhado, o gate que bloqueia Content Forge e Social Monitor quando não há perfis, o seletor de perfil que filtra conteúdo/menções por perfil, e a indicação do perfil ativo na Orchestrator Bar. Juntos, esses componentes fazem o conceito multi-perfil permear toda a experiência do KeepBiz.

## Escopo

### Contexto (`src/contexts/ProfileContext.tsx`)

```tsx
interface ProfileContextValue {
  profiles: Profile[]
  activeProfileId: string | null
  hasProfiles: boolean
  setActiveProfileId: (id: string | null) => void
  addProfile: (profile: Profile) => void
  removeProfile: (id: string) => void
}
```

- Inicializado com dados de `data/profiles.ts`
- `activeProfileId` persiste via `localStorage('keepbiz-active-profile')`
- Prover no `App.tsx`, wrapping rotas protegidas

### Gate (`src/components/ProfileGate.tsx`)

- Se `hasProfiles === true`: renderiza children
- Se `hasProfiles === false`: empty state com ícone `Lock` (64px, muted), mensagem explicativa, CTA "Criar Primeiro Perfil" → `/profiles/new`
- Aplicado em `/monitor`, `/content`, `/content/calendar`
- NÃO afeta Agent Core nem Settings

### Seletor (`src/components/ProfileSelector.tsx`)

- Desktop: tab group horizontal ("Todos os perfis" + uma tab por perfil)
- Mobile: dropdown Select
- Status dot colorido por perfil (green ativo, yellow rascunho)
- Renderizado no topo de MonitorPage e ContentPage
- Seleção atualiza `activeProfileId` no context

### Filtragem de Conteúdo

- Adicionar campo `profileId?: string` em `Mention` e `ContentItem` nos types
- Distribuir `'PRF-001'` e `'PRF-002'` nos mock data de `mentions.ts` e `content.ts`
- Quando perfil selecionado: filtrar dados pelo `profileId`
- "Todos os perfis": sem filtro (comportamento atual)

### Orchestrator Bar

- Quando `activeProfileId !== null`: exibir `identity.businessName` com ícone `IdentificationBadge`
- Quando `null`: exibir "Todos os perfis"
- Texto truncado com ellipsis, transição opacity fade 200ms

## Features

1. **F-025-A**: ProfileContext — criar contexto com profiles, activeProfileId, hasProfiles, métodos add/remove/setActive, inicializar com mock data, prover no App.tsx
2. **F-025-B**: ProfileGate — componente que bloqueia conteúdo quando `hasProfiles === false`, empty state com Lock + CTA
3. **F-025-C**: Integração do gate — aplicar ProfileGate em rotas `/monitor`, `/content`, `/content/calendar`
4. **F-025-D**: ProfileSelector — tab group desktop / dropdown mobile com "Todos os perfis" + perfis individuais com status dot
5. **F-025-E**: Filtragem mock — adicionar `profileId` aos types e mock data de menções/conteúdo, filtrar por perfil selecionado em Monitor e Content
6. **F-025-F**: Orchestrator Bar — exibir nome do perfil ativo (ou "Todos os perfis") com ícone e transição suave
7. **F-025-G**: i18n — strings do gate, seletor e Orchestrator Bar em pt/en/es

## Limites

- NÃO implementar filtro real de dados — é apenas mock (distribuir profileId manualmente)
- Gate não afeta Agent Core (`/agents/*`) nem Settings (`/settings`)
- Seletor persiste via localStorage mas não sobrevive a clear

## Dependências

- **PRP-022** — tipos `Profile` e mock data
- **PRP-023** — ProfilesPage e rota `/profiles/new` para CTA do gate
