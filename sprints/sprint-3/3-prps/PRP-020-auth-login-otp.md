# PRP-020 — Auth: Login + OTP

**Passada:** 3 — Auth
**Specs:** S-021
**Discoveries:** D-028, D-035
**Prioridade:** 9

---

## Objetivo

Criar a tela de login para ambos os apps com suporte a três métodos de autenticação: email/senha, OTP via WhatsApp e OTP via email. No mock, qualquer credencial é aceita. A tela deve ser visualmente coesa com a landing e usar os design tokens do app. Inclui componentes reutilizáveis de OTP (input de 6 dígitos e timer) que serão reaproveitados no registro.

## Escopo

### Telas / Componentes
- **LoginPage** (`src/pages/LoginPage.tsx`): substituindo o placeholder de PRP-015, card centralizado com tabs para 3 métodos
- **OtpInput** (`src/components/OtpInput.tsx`): input de 6 dígitos com auto-advance, backspace e paste support
- **OtpTimer** (`src/components/OtpTimer.tsx`): contagem regressiva de 60s com "Reenviar código"

### Tab 1 — Email + Senha (default)
- Campos: email, senha (toggle visibility), checkbox "Lembrar de mim"
- Botão "Entrar" → `auth.login()` → redirect para rota anterior ou `/monitor`
- Links: "Esqueci minha senha" (toast mock), "Criar conta" (→ `/register`)

### Tab 2 — OTP via WhatsApp
- Step 1: campo telefone (+55 prefixado) → "Enviar Código" (delay 1s com spinner)
- Step 2: OtpInput (6 dígitos) + OtpTimer (60s) → "Confirmar" → `auth.login()` → redirect

### Tab 3 — OTP via Email
- Step 1: campo email → "Enviar Código" (delay 1s com spinner)
- Step 2: OtpInput (6 dígitos) + OtpTimer (60s) → "Confirmar" → `auth.login()` → redirect

### Diferenças visuais KeepBiz vs. KeepSolo
- KeepBiz: logo cores frias, card borda sutil, fundo neutro, placeholder "voce@empresa.com.br"
- KeepSolo: logo cores quentes, cantos arredondados, fundo quente, placeholder "voce@email.com"
- Lógica idêntica em ambos

## Features

1. **F-020-A**: LoginPage com tab email/senha — card centralizado, campos email + senha com toggle visibility, checkbox "Lembrar de mim", botão Entrar, links auxiliares
2. **F-020-B**: LoginPage com tab WhatsApp OTP — step 1 (telefone) → delay spinner → step 2 (código OTP)
3. **F-020-C**: LoginPage com tab Email OTP — step 1 (email) → delay spinner → step 2 (código OTP)
4. **F-020-D**: Componente OtpInput — 6 inputs individuais com auto-advance, backspace volta, paste de código completo, estilo mobile-friendly
5. **F-020-E**: Componente OtpTimer — contagem regressiva visual "Reenviar em 0:XX", ao expirar mostra "Reenviar código" clicável
6. **F-020-F**: Implementar LoginPage no KeepSolo — mesma lógica com visual distinto (cores quentes, cantos arredondados)

## Limites

- NÃO implementar auth real — qualquer credencial aceita
- NÃO implementar recuperação de senha real — "Esqueci senha" mostra toast mock
- "Lembrar de mim" é decorativo (seta localStorage, sem efeito funcional)
- OTP timer é apenas visual — não há envio real de código

## Dependências

- **PRP-015** — AuthContext e rota `/login` devem existir
