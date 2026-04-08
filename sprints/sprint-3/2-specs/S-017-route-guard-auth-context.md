# S-017 — Route Guard + Auth Context + Continuidade Visual

**Discoveries:** D-030, D-036
**Passada:** 1 (Foundation Sprint-3)
**Prioridade:** 8 (pré-requisito para todas as rotas públicas)
**Depende de:** S-001 (scaffold base)

---

## Objetivo

Introduzir a separação entre rotas públicas (landing, login, register, pricing) e rotas protegidas (dashboard/app) em ambos os apps. Criar um `AuthContext` com flag `isLoggedIn` em localStorage e um componente `RouteGuard` que redireciona não-autenticados. Garantir continuidade visual entre landing e app usando os mesmos design tokens.

---

## AuthContext (`src/contexts/AuthContext.tsx`)

```ts
interface AuthContextValue {
  isLoggedIn: boolean
  user: { name: string; email: string } | null
  login: (name: string, email: string) => void
  logout: () => void
}
```

### Comportamento

- `login(name, email)` → seta `localStorage.setItem('isLoggedIn', 'true')` + armazena `{ name, email }` em `localStorage('user')` + atualiza state
- `logout()` → remove `isLoggedIn` e `user` do localStorage, redireciona para `/landing`
- Inicialização: lê `isLoggedIn` do localStorage no mount. Se `true`, restaura dados do `user`
- **Mock**: qualquer combinação de credenciais é aceita — sem validação real

---

## RouteGuard (`src/components/RouteGuard.tsx`)

```tsx
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

---

## Reestruturação de Rotas (`App.tsx`)

### Rotas Públicas (sem AppLayout, sem RouteGuard)

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `<Navigate to="/landing">` | Redirect para landing |
| `/landing` | `LandingPage` | Landing page pública |
| `/login` | `LoginPage` | Tela de login |
| `/register` | `RegisterPage` | Tela de registro |
| `/pricing` | `<Navigate to="/landing#pricing">` | Âncora para seção pricing da landing |

### Rotas Protegidas (com AppLayout + RouteGuard)

Todas as rotas existentes do dashboard permanecem iguais, mas envolvidas no `RouteGuard`:

```tsx
<Routes>
  {/* Rotas públicas */}
  <Route path="/" element={<Navigate to="/landing" replace />} />
  <Route path="/landing" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Rotas protegidas */}
  <Route element={<RouteGuard><AppLayout /></RouteGuard>}>
    <Route path="/monitor" element={<MonitorPage />} />
    {/* ... demais rotas existentes ... */}
  </Route>
</Routes>
```

---

## Logout

- Adicionar botão/link de logout no menu de configurações (KeepBiz: `SettingsPage`, KeepSolo: `ConfigPage`)
- Também no header/sidebar se houver menu de usuário
- `logout()` limpa localStorage e redireciona para `/landing`

---

## Continuidade Visual (D-036)

- As páginas públicas (landing, login, register) **devem usar os mesmos design tokens** (CSS variables) já definidos nos apps:
  - KeepBiz: cores frias (blues/grays), tipografia, componentes shadcn
  - KeepSolo: cores quentes (ambers/oranges), cantos arredondados, componentes shadcn
- Dark mode nas páginas públicas deve espelhar o dark mode do app
- O `ThemeProvider` existente deve envolver também as rotas públicas (já o faz no nível do App)
- Transição visual ao entrar no dashboard: sem "flash" — as cores e tipografia são as mesmas

---

## Critérios de Aceite

1. [ ] Acessar `/monitor` sem login redireciona para `/login`
2. [ ] Acessar `/landing` sem login funciona normalmente
3. [ ] Após login, rotas protegidas ficam acessíveis
4. [ ] Logout limpa estado e redireciona para `/landing`
5. [ ] Refresh da página mantém sessão (localStorage persistido)
6. [ ] Rota `/` redireciona para `/landing`
7. [ ] Páginas públicas usam mesmos design tokens do app (cores, tipografia, shadcn)
8. [ ] Dark mode funciona nas páginas públicas
9. [ ] `AuthContext` disponível em toda a árvore de componentes
10. [ ] Ambos os apps (KeepBiz e KeepSolo) implementam o mesmo padrão
