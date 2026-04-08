# PRP-021 — Auth: Registro + Seleção de Plano

**Passada:** 3 — Auth
**Specs:** S-022
**Discoveries:** D-029
**Prioridade:** 9

---

## Objetivo

Criar a tela de registro (onboarding) para ambos os apps com wizard de 3 steps: dados pessoais, seleção de plano e confirmação. Suporte a OTP como método alternativo de criação de conta. No mock, qualquer dado é aceito e ao confirmar o usuário é logado e redirecionado ao dashboard.

## Escopo

### Telas / Componentes
- **RegisterPage** (`src/pages/RegisterPage.tsx`): substituindo o placeholder de PRP-015, wizard de 3 etapas com stepper visual
- **PasswordStrength** (`src/components/PasswordStrength.tsx`): indicador visual de força de senha (decorativo)

### Step 1 — Dados da Conta
- Método default: nome, email, senha (toggle + indicador de força), confirmar senha
- Divider "Ou crie sua conta com": botões WhatsApp OTP / Email OTP
- Método OTP: nome + telefone ou email + OtpInput (reutiliza componentes de PRP-020)
- KeepBiz: campo extra "Empresa" (opcional)
- Validação mock: nome min 2 chars, email formato válido, senha min 6 chars, confirmar senha coincide

### Step 2 — Seleção de Plano
- Reutiliza `<PricingSection>` de PRP-016 com `onSelectPlan` e `selectedPlan`
- Pré-seleção via query param `?plan=pro`
- Ao menos um plano deve estar selecionado para avançar
- Cards em modo compacto dentro do wizard

### Step 3 — Confirmação
- Resumo: nome, email, plano selecionado, método de auth
- Checkbox "Aceito os Termos de Uso e Política de Privacidade" (links mock)
- Botão "Criar Conta" com loading state (spinner, 1.5s delay)
- Chama `auth.login()` → toast de sucesso → redirect para `/monitor`

### State Management
- `useReducer` local com: `step`, `method`, `name`, `email`, `phone`, `password`, `confirmPassword`, `company`, `selectedPlan`, `billingCycle`, `termsAccepted`

### Diferenças visuais KeepBiz vs. KeepSolo
- KeepBiz: heading "Crie sua conta corporativa", campo Empresa, planos Starter/Growth/Enterprise, CTA "Criar Conta", cores frias
- KeepSolo: heading "Crie sua conta", sem campo Empresa, planos Free/Pro/Scale, CTA "Começar Agora", cores quentes

## Features

1. **F-021-A**: RegisterPage Step 1 (email/senha) — stepper visual, campos nome/email/senha/confirmar com validação mock, indicador de força de senha
2. **F-021-B**: RegisterPage Step 1 (OTP alternativo) — divider + botões OTP, troca para campos nome + telefone/email + OtpInput, reutiliza componentes de PRP-020
3. **F-021-C**: RegisterPage Step 2 (seleção de plano) — integração do PricingSection com `onSelectPlan`, pré-seleção via query param, navegação Voltar/Próximo
4. **F-021-D**: RegisterPage Step 3 (confirmação) — resumo dos dados, checkbox de termos, botão com loading → `auth.login()` → toast → redirect
5. **F-021-E**: PasswordStrength — componente visual com 3 barras coloridas (fraca/média/forte) baseado no comprimento da senha
6. **F-021-F**: Implementar RegisterPage no KeepSolo — mesma lógica com visual distinto (cores quentes, sem campo Empresa, heading pessoal)

## Limites

- NÃO implementar registro real — qualquer dado aceito
- NÃO implementar envio real de OTP — reutiliza mock de PRP-020
- Indicador de força de senha é decorativo (regras simplificadas por comprimento)
- Termos de Uso e Política de Privacidade são links mock (`#`)

## Dependências

- **PRP-015** — AuthContext e rota `/register` devem existir
- **PRP-016** — componente PricingSection deve existir para Step 2
- **PRP-020** — componentes OtpInput e OtpTimer devem existir para método alternativo
