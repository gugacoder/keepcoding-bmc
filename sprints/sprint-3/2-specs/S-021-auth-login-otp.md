# S-021 — Auth: Login + OTP

**Discoveries:** D-028, D-035
**Passada:** 3 (Auth)
**Prioridade:** 9
**Depende de:** S-017 (route guard + AuthContext)

---

## Objetivo

Criar a tela de login para ambos os apps com suporte a três métodos de autenticação: email/senha, OTP via WhatsApp e OTP via email. No mock, qualquer credencial é aceita. A tela deve ser visualmente coesa com a landing e usar os design tokens do app.

---

## Página (`src/pages/LoginPage.tsx`)

### Layout

- Centralizada verticalmente e horizontalmente
- Card com largura máxima (~400px)
- Logo do app no topo
- Tabs ou segmented control para alternar entre os 3 métodos
- Link "Criar conta" → `/register` no rodapé do card
- Link "Voltar à Landing" → `/landing`

### Tab 1 — Email + Senha (default)

```
[Logo]
[Tabs: Email/Senha | WhatsApp | Email OTP]

Campo: Email
Campo: Senha (com toggle visibility)
[ ] Lembrar de mim

[Botão: Entrar]

Esqueci minha senha (link mock → toast "Email enviado!")
Não tem conta? Criar conta (→ /register)
```

**Comportamento:**
- Campos email e senha obrigatórios (validação HTML básica)
- Botão "Entrar" → chama `auth.login(name, email)` com `name` extraído do email (parte antes do @)
- Qualquer combinação de email/senha é aceita
- Após login: redireciona para a rota salva em `location.state.from` ou `/monitor`
- "Lembrar de mim" → seta `localStorage('rememberMe', 'true')` (decorativo)

### Tab 2 — OTP via WhatsApp

```
[Logo]
[Tabs: Email/Senha | WhatsApp | Email OTP]

--- Step 1 ---
Campo: Número WhatsApp (+55 prefixado)
[Botão: Enviar Código]

--- Step 2 (após "Enviar Código") ---
Campo: Código de 6 dígitos (input com 6 boxes individuais ou um input masked)
Timer: 60s contagem regressiva
Link: "Reenviar código" (habilitado quando timer = 0)
[Botão: Confirmar]
```

**Comportamento:**
- Step 1: qualquer número com ≥8 dígitos é aceito. Ao clicar "Enviar Código" → delay de 1s com spinner → transição para Step 2
- Step 2: qualquer código de 6 dígitos é aceito. Timer de 60s (apenas visual, `setInterval`). "Reenviar código" reinicia o timer
- Ao confirmar código válido (6 dígitos) → `auth.login()` → redirect

### Tab 3 — OTP via Email

```
[Logo]
[Tabs: Email/Senha | WhatsApp | Email OTP]

--- Step 1 ---
Campo: Email
[Botão: Enviar Código]

--- Step 2 ---
Campo: Código de 6 dígitos
Timer: 60s
Link: "Reenviar código"
[Botão: Confirmar]
```

**Comportamento:** Idêntico ao WhatsApp OTP, mas com campo de email em vez de telefone.

---

## Componente OTP Input (`src/components/OtpInput.tsx`)

Input de 6 dígitos com UX polida:

```tsx
interface OtpInputProps {
  length?: number          // Default: 6
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
}
```

- 6 inputs individuais (cada um aceita 1 dígito)
- Auto-focus avança para o próximo input ao digitar
- Backspace volta para o input anterior
- Paste de código completo (6 dígitos) preenche todos os campos
- Estilo: bordas arredondadas, tamanho grande (fácil de tocar no mobile)

---

## Timer Component (`src/components/OtpTimer.tsx`)

```tsx
interface OtpTimerProps {
  seconds: number          // Default: 60
  onExpire: () => void     // Habilita "Reenviar"
}
```

- Contagem regressiva visual: "Reenviar em 0:45"
- Ao expirar: texto muda para "Reenviar código" (link clicável)

---

## Diferenças KeepBiz vs. KeepSolo

| Aspecto | KeepBiz | KeepSolo |
|---|---|---|
| Logo | KeepBiz (cores frias) | KeepSolo (cores quentes) |
| Tom visual | Card com borda sutil, fundo neutro | Card com cantos arredondados, fundo quente |
| Placeholder email | "voce@empresa.com.br" | "voce@email.com" |
| Texto "Esqueci senha" | "Esqueci minha senha" | "Esqueci minha senha" |

A lógica é a mesma — apenas os tokens visuais mudam.

---

## Critérios de Aceite

1. [ ] Tela de login renderiza em `/login` sem necessidade de auth
2. [ ] Tab email/senha funciona: qualquer credencial aceita, redireciona ao dashboard
3. [ ] Tab WhatsApp OTP: step 1 (telefone) → step 2 (código) funciona
4. [ ] Tab Email OTP: step 1 (email) → step 2 (código) funciona
5. [ ] OTP input de 6 dígitos com auto-advance e paste support
6. [ ] Timer de 60s com "Reenviar código" ao expirar
7. [ ] Qualquer código de 6 dígitos é aceito
8. [ ] Link "Criar conta" leva a `/register`
9. [ ] Link "Esqueci minha senha" mostra toast mock
10. [ ] Após login, redireciona para rota anterior ou `/monitor`
11. [ ] Ambos os apps implementam a mesma lógica com visual distinto
12. [ ] Responsivo: card centralizado, inputs acessíveis no mobile
