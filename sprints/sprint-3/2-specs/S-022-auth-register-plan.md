# S-022 — Auth: Registro + Seleção de Plano

**Discoveries:** D-029
**Passada:** 3 (Auth)
**Prioridade:** 9
**Depende de:** S-017 (AuthContext), S-020 (pricing data), S-021 (componentes OTP compartilhados)

---

## Objetivo

Criar a tela de registro (onboarding) para ambos os apps com wizard de 3 steps: dados pessoais, seleção de plano e confirmação. Suporte a OTP como método alternativo de criação de conta. No mock, qualquer dado é aceito e ao confirmar o usuário é logado e redirecionado ao dashboard.

---

## Página (`src/pages/RegisterPage.tsx`)

### Layout

- Centralizada verticalmente
- Card com largura máxima (~500px)
- Logo do app no topo
- Stepper visual mostrando 3 etapas (similar ao wizard de workflows S-004)
- Link "Já tem conta? Entrar" → `/login` no rodapé

---

## Step 1 — Dados da Conta

### Método: Email + Senha (default)

```
Stepper: [1. Conta] — [2. Plano] — [3. Confirmar]

Campo: Nome completo
Campo: Email
Campo: Senha (com toggle visibility + indicador de força mock)
Campo: Confirmar senha

--- ou ---

Divider: "Ou crie sua conta com"
Botões: [WhatsApp OTP] [Email OTP]

[Botão: Próximo →]
```

### Método alternativo: OTP

Ao clicar em "WhatsApp OTP" ou "Email OTP":
- Campos de nome/email/senha são substituídos por:
  - Campo: Nome completo
  - Campo: Telefone (WhatsApp) ou Email (Email OTP)
  - Step de código de 6 dígitos (reutiliza `OtpInput` de S-021)
- Após código confirmado → avança para Step 2

### Validação (mock)

- Nome: obrigatório, min 2 chars
- Email: formato válido (regex simples)
- Senha: min 6 chars
- Confirmar senha: deve coincidir
- OTP: qualquer código de 6 dígitos aceito

---

## Step 2 — Seleção de Plano

```
Stepper: [1. Conta ✓] — [2. Plano] — [3. Confirmar]

[PricingSection app={app} selectedPlan={planFromUrl} onSelectPlan={...} showBillingToggle={true}]

[← Voltar]   [Próximo →]
```

- Reutiliza o componente `PricingSection` de S-020
- Se a URL contém `?plan=pro`, esse plano vem pré-selecionado (highlight + selected state)
- O usuário pode trocar de plano clicando em outro card
- Ao menos um plano deve estar selecionado para avançar
- Layout: no contexto do wizard, os cards de pricing devem ser um pouco menores (compact mode via prop)

---

## Step 3 — Confirmação

```
Stepper: [1. Conta ✓] — [2. Plano ✓] — [3. Confirmar]

Resumo:
- Nome: João Silva
- Email: joao@empresa.com
- Plano: Growth (R$ 897/mês)
- Método: Email + Senha

Checkbox: [ ] Aceito os Termos de Uso e Política de Privacidade
(links mock para # — texto sublinhado)

[← Voltar]   [Criar Conta]
```

### Comportamento ao confirmar

1. Botão "Criar Conta" com loading state (spinner, 1.5s delay simulado)
2. Chama `auth.login(name, email)` com os dados do Step 1
3. Toast de sucesso: "Conta criada com sucesso! Bem-vindo ao KeepBiz/KeepSolo"
4. Redireciona para `/monitor` (dashboard)

---

## Indicador de Força de Senha

Componente visual simples (decorativo, não real):

```tsx
function PasswordStrength({ password }: { password: string }) {
  // Regras mock:
  // < 6 chars: fraca (vermelho, 1 barra)
  // 6-9 chars: média (amarelo, 2 barras)
  // ≥ 10 chars: forte (verde, 3 barras)
}
```

3 barrinhas coloridas + texto "Fraca" / "Média" / "Forte".

---

## Diferenças KeepBiz vs. KeepSolo

| Aspecto | KeepBiz | KeepSolo |
|---|---|---|
| Heading | "Crie sua conta corporativa" | "Crie sua conta" |
| Campo extra | "Empresa" (opcional, texto) | — |
| Planos | Starter / Growth / Enterprise | Free / Pro / Scale |
| Tom visual | Cores frias, formal | Cores quentes, pessoal |
| CTA final | "Criar Conta" | "Começar Agora" |

---

## State Management

```ts
interface RegisterState {
  step: 1 | 2 | 3
  method: 'email-password' | 'whatsapp-otp' | 'email-otp'
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  company: string            // KeepBiz only
  selectedPlan: string | null
  billingCycle: 'monthly' | 'yearly'
  termsAccepted: boolean
}
```

Gerenciado via `useReducer` local na página.

---

## Critérios de Aceite

1. [ ] Tela de registro renderiza em `/register`
2. [ ] Stepper visual de 3 etapas com progresso correto
3. [ ] Step 1: campos nome/email/senha com validação básica
4. [ ] Step 1: opção de criar conta via OTP (WhatsApp ou email)
5. [ ] Step 2: pricing cards com seleção de plano funcional
6. [ ] Step 2: plano pré-selecionado via `?plan=` na URL
7. [ ] Step 3: resumo correto dos dados + checkbox de termos
8. [ ] Botão "Criar Conta" com loading → login → redirect ao dashboard
9. [ ] Navegação Voltar/Próximo entre steps funciona
10. [ ] Indicador de força de senha visual
11. [ ] Link "Já tem conta? Entrar" → `/login`
12. [ ] Ambos os apps implementam com visual distinto
13. [ ] Responsivo: wizard acessível no mobile
