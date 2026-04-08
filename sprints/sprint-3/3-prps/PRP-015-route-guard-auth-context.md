# PRP-015 — Route Guard + Auth Context

**Passada:** 1 — Foundation Sprint-3
**Specs:** S-017
**Discoveries:** D-030, D-036
**Prioridade:** 10 (pré-requisito absoluto para todas as telas públicas)

---

## Objetivo

Introduzir a separação entre rotas públicas (landing, login, register, pricing) e rotas protegidas (dashboard/app) em ambos os apps, criando um `AuthContext` com mock auth (qualquer credencial aceita) e um `RouteGuard` que redireciona não-autenticados. Garantir continuidade visual entre landing e app usando os mesmos design tokens.

## Escopo

### Componentes
- **AuthContext** (`src/contexts/AuthContext.tsx`): Provider com `isLoggedIn`, `user`, `login()`, `logout()` — persistido em localStorage
- **RouteGuard** (`src/components/RouteGuard.tsx`): Wrapper que redireciona não-autenticados para `/login`
- **Reestruturação de App.tsx**: Separar rotas públicas (`/`, `/landing`, `/login`, `/register`) das protegidas (todas as existentes)

### Rotas Públicas (sem AppLayout, sem RouteGuard)
| Rota | Comportamento |
|---|---|
| `/` | Redirect para `/landing` |
| `/landing` | Landing page pública |
| `/login` | Tela de login |
| `/register` | Tela de registro |
| `/pricing` | Redirect para `/landing#pricing` |

### Rotas Protegidas (com AppLayout + RouteGuard)
Todas as rotas existentes do dashboard permanecem, envolvidas no `RouteGuard`.

### Logout
- Botão/link de logout em SettingsPage (KeepBiz) e ConfigPage (KeepSolo)
- `logout()` limpa localStorage e redireciona para `/landing`

### Continuidade Visual (D-036)
- Páginas públicas usam os mesmos design tokens (CSS variables) já definidos nos apps
- Dark mode nas páginas públicas espelha o dark mode do app
- ThemeProvider envolve também rotas públicas

## Features

1. **F-015-A**: AuthContext — Provider com `isLoggedIn`, `user`, `login()`, `logout()`, persistência em localStorage, restauração no mount
2. **F-015-B**: RouteGuard — componente que redireciona para `/login` se não autenticado, preserva `location.state.from` para redirect pós-login
3. **F-015-C**: Reestruturação de rotas KeepBiz — separar rotas públicas e protegidas em `App.tsx`, adicionar redirects (`/` → `/landing`, `/pricing` → `/landing#pricing`)
4. **F-015-D**: Reestruturação de rotas KeepSolo — mesmo padrão aplicado ao KeepSolo
5. **F-015-E**: Logout — botão de logout em SettingsPage/ConfigPage, limpa estado e redireciona para `/landing`
6. **F-015-F**: Páginas placeholder públicas — componentes mínimos para `/landing`, `/login`, `/register` (apenas esqueleto com título, serão substituídos por PRPs posteriores)

## Limites

- NÃO implementar o conteúdo das landing pages (→ PRP-017, PRP-018)
- NÃO implementar formulários de login ou registro (→ PRP-020, PRP-021)
- Placeholders públicos são componentes mínimos — apenas título e link para navegação
- Auth é mock: qualquer credencial aceita, sem validação real

## Dependências

- **PRP-001** — scaffold base deve existir (sprint-2)
- **PRP-002 / PRP-003** — shells KeepBiz e KeepSolo devem existir para envolver no RouteGuard
