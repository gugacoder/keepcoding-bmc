# PRP-026 — KeepSolo: Onboarding de Perfil (First-Run)

**Passada:** 4 — Perfil
**Specs:** S-029
**Discoveries:** D-042, D-044, D-045
**Prioridade:** 10

---

## Objetivo

Implementar o fluxo de onboarding de perfil no KeepSolo como experiência de primeiro acesso. Após login, se o perfil não estiver configurado, o usuário é redirecionado para `/onboarding` — um wizard de 4 etapas com linguagem pessoal e transparente (nunca menciona "perfil"). O wizard segue as mesmas etapas do KeepBiz mas simplificado: coleta → pesquisa → validação → pronto.

## Escopo

### Telas / Componentes

- **OnboardingPage** (`src/pages/OnboardingPage.tsx`): fullscreen (sem BottomNav/header), stepper de 4 dots, conteúdo da etapa, botões Voltar/Avançar
- **SoloProfileContext** (`src/contexts/ProfileContext.tsx`): contexto com perfil único, flag `isConfigured`, métodos `completeOnboarding` e `updateProfile`

### Rota

```
/onboarding → OnboardingPage (auth-protected, fora do AppLayout)
```

### Detecção de First-Run

- `profileConfigured === false` + rota ≠ `/onboarding` → redirecionar para `/onboarding`
- `profileConfigured === true` + rota = `/onboarding` → redirecionar para `/monitor`
- Flag persiste via `localStorage('keepsolo-profile-configured')`

### Stepper (4 dots)

1. "Seu Negócio"
2. "Pesquisando..."
3. "Validação"
4. "Pronto!"

### Etapa 1 — "Me conta sobre o seu negócio"

- Título conversacional, subtítulo: "Vou usar isso pra entender como posso te ajudar."
- Campos: Nome do negócio (obrigatório), URL (opcional), Instagram ou principal rede (opcional)
- Tom pessoal, sem jargão

### Etapa 2 — "Deixa eu pesquisar um pouco..."

- Loading em tom amber/orange (identidade KeepSolo)
- Items: "Procurando na internet..." → "Analisando suas redes..." → "Entendendo seu mercado..." → "Quase lá..."
- Auto-avanço

### Etapa 3 — "Encontrei isso — está certo?"

- 5-6 achados mock baseados em Cia Cuidadores
- Mesma lógica: Confirmar/Corrigir/Ignorar com inline edit
- CTA "Tudo certo!" habilitado quando todos revisados

### Etapa 4 — "Pronto! Conheço seu negócio."

- Tela de sucesso + resumo enxuto (nome, segmento, plataforma principal)
- Select de tom de voz (default "amigável")
- Botão "Começar a usar" → `completeOnboarding()` → navega para `/monitor`
- Animação sutil de sucesso (confetti opcional)

## Features

1. **F-026-A**: SoloProfileContext — contexto com `profile`, `isConfigured`, `completeOnboarding()`, `updateProfile()`, inicializado com mock data, prover no App.tsx
2. **F-026-B**: Detecção first-run — lógica no RouteGuard para redirecionar para `/onboarding` quando perfil não configurado
3. **F-026-C**: OnboardingPage layout — fullscreen sem BottomNav, stepper de 4 dots, identidade visual amber/orange
4. **F-026-D**: Etapa 1 (Coleta) — formulário conversacional com nome, URL, rede social principal
5. **F-026-E**: Etapa 2 (Loading) — animação de pesquisa com items sequenciais e auto-avanço
6. **F-026-F**: Etapa 3 (Validação) — achados mock com Confirmar/Corrigir/Ignorar, correção inline
7. **F-026-G**: Etapa 4 (Pronto) — resumo enxuto, select de tom, botão "Começar a usar" com completeOnboarding
8. **F-026-H**: i18n — strings do onboarding em pt/en/es

## Limites

- NÃO mencionar a palavra "perfil" em nenhuma string — linguagem transparente
- NÃO implementar pesquisa real — etapa 2 é simulada, etapa 3 usa achados fixos
- Flag `isConfigured` persiste em localStorage mas reseta com clear
- Onboarding simplificado: 4 etapas (vs. 5 do KeepBiz — sem etapa separada de nicho)

## Dependências

- **PRP-022** — tipos `Profile`, `soloProfile` e `profileConfigured`
