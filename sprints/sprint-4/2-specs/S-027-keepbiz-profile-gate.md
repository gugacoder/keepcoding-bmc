# S-027 — KeepBiz: Gate de Perfil em Criação e Monitor

**Discoveries:** D-040
**Passada:** 4 (Gate)
**Prioridade:** 9
**Depende de:** S-024, S-025

---

## Objetivo

Bloquear o acesso às áreas de Content Forge (`/content`) e Social Monitor (`/monitor`) quando o usuário não tem nenhum perfil criado no KeepBiz. O gate é um requisito explícito do TASK.md.

---

## Lógica do Gate

### Contexto de Perfis (`src/contexts/ProfileContext.tsx`)

Criar um contexto React que gerencia o state de perfis:

```tsx
interface ProfileContextValue {
  profiles: Profile[]
  activeProfileId: string | null      // para o seletor (spec S-028)
  hasProfiles: boolean                 // computed: profiles.length > 0
  setActiveProfileId: (id: string | null) => void
  addProfile: (profile: Profile) => void
  removeProfile: (id: string) => void
}
```

- Inicializado com os dados de `data/profiles.ts`
- `hasProfiles` é a flag que o gate consulta
- Prover no `App.tsx`, wrapping as rotas protegidas

### Componente Gate (`src/components/ProfileGate.tsx`)

```tsx
interface ProfileGateProps {
  children: React.ReactNode
}
```

- Se `hasProfiles === true`: renderiza `children` normalmente
- Se `hasProfiles === false`: renderiza empty state bloqueante

### Empty State do Gate

```
┌───────────────────────────────────────────────┐
│                                               │
│              🔒 (ícone Lock)                  │
│                                               │
│      Para acessar esta área,                  │
│      crie seu primeiro perfil.                │
│                                               │
│    Os perfis são o ponto de partida para      │
│    criação de conteúdo e monitoramento.       │
│                                               │
│        [Criar Primeiro Perfil]                │
│                                               │
└───────────────────────────────────────────────┘
```

- Centralizado vertical e horizontalmente
- Ícone `Lock` (Phosphor), tamanho 64px, cor muted
- CTA navega para `/profiles/new`
- Usar componente `EmptyState` existente se compatível, ou criar variação

### Integração nas Páginas

Aplicar o `ProfileGate` nas rotas de Content e Monitor no `App.tsx`:

```tsx
<Route path="/monitor" element={<ProfileGate><MonitorPage /></ProfileGate>} />
<Route path="/content" element={<ProfileGate><ContentPage /></ProfileGate>} />
<Route path="/content/calendar" element={<ProfileGate><ContentCalendarPage /></ProfileGate>} />
```

Alternativa: aplicar o gate dentro de cada página (wrapping do conteúdo). A decisão fica com o implementador, desde que o gate funcione.

---

## Comportamento

- Gate aparece imediatamente após login se não houver perfis
- Após criar o primeiro perfil (wizard), o gate desaparece automaticamente (re-render via ProfileContext)
- Gate é local ao KeepBiz — não afeta Agent Core nem Settings
- Para testar: remover os perfis mock do array inicial em `data/profiles.ts`

---

## Critérios de Aceite

1. [ ] `ProfileContext` criado e provido no `App.tsx`
2. [ ] `/monitor` exibe gate quando `profiles.length === 0`
3. [ ] `/content` exibe gate quando `profiles.length === 0`
4. [ ] `/content/calendar` exibe gate quando `profiles.length === 0`
5. [ ] Gate exibe ícone de cadeado, mensagem explicativa e CTA para `/profiles/new`
6. [ ] Após criar perfil (state update), gate desaparece sem reload
7. [ ] Agent Core (`/agents/*`) e Settings (`/settings`) não são afetados pelo gate
8. [ ] i18n: strings do gate em pt/en/es
