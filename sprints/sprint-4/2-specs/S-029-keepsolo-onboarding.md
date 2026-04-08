# S-029 — KeepSolo: Onboarding de Perfil (First-Run)

**Discoveries:** D-042, D-044, D-045
**Passada:** 3 (Wizard)
**Prioridade:** 10
**Depende de:** S-024

---

## Objetivo

Implementar o fluxo de onboarding de perfil no KeepSolo como experiência de primeiro acesso. Após login, se o perfil não estiver configurado, o usuário é redirecionado para `/onboarding` — um wizard de 4 etapas que não menciona "perfil" (linguagem transparente). O wizard segue as mesmas etapas do KeepBiz (coleta, pesquisa, validação, nicho) mas com tom pessoal e simplificado.

---

## Rota

Adicionar em `App.tsx`:

```tsx
{/* Semi-protected: needs auth but no profile required */}
<Route element={<RouteGuard />}>
  <Route path="/onboarding" element={<OnboardingPage />} />
</Route>
```

A rota `/onboarding` fica dentro do guard de auth, mas fora do `AppLayout` (não mostra BottomNav nem header durante o onboarding).

---

## Detecção de First-Run

### Lógica no RouteGuard ou AppLayout

Ler `profileConfigured` de `data/profiles.ts` (ou de um state em context):

- Se `profileConfigured === false` e rota atual ≠ `/onboarding`: redirecionar para `/onboarding`
- Se `profileConfigured === true` e rota atual = `/onboarding`: redirecionar para `/monitor`

### ProfileContext para KeepSolo (`src/contexts/ProfileContext.tsx`)

```tsx
interface SoloProfileContextValue {
  profile: Profile
  isConfigured: boolean
  completeOnboarding: () => void   // seta isConfigured = true
  updateProfile: (updates: Partial<Profile>) => void
}
```

- Inicializado com `soloProfile` e `profileConfigured` de `data/profiles.ts`
- `completeOnboarding()` seta flag no localStorage (`keepsolo-profile-configured`)
- Prover no `App.tsx`

---

## Página (`src/pages/OnboardingPage.tsx`)

### Layout Geral

- Fullscreen, sem BottomNav, sem header
- Logo KeepSolo no topo (pequeno)
- Stepper simplificado: 4 dots no topo (não labels completos — tom mais leve)
- Conteúdo da etapa no centro
- Tons quentes (amber/orange) consistentes com identidade KeepSolo
- Botões "Voltar" e "Avançar" no rodapé

### Stepper (4 etapas)

1. "Seu Negócio"
2. "Pesquisando..."
3. "Validação"
4. "Pronto!"

---

## Etapa 1 — "Me conta sobre o seu negócio"

Formulário leve, conversacional:

- Título: **"Me conta sobre o seu negócio"**
- Subtítulo: "Vou usar isso pra entender como posso te ajudar."
- Campos:
  - Nome do negócio (text input, obrigatório)
  - URL do site (text input, opcional)
  - Instagram ou principal rede social (text input, opcional)
- Tom: direto, pessoal, sem jargão técnico
- Botão "Avançar" habilitado quando nome preenchido

---

## Etapa 2 — "Deixa eu pesquisar um pouco..."

Loading animado (mesmo conceito da etapa 2 do KeepBiz, mas com visual KeepSolo):

- Ícone `MagnifyingGlass` com pulse em amber
- Texto: **"Deixa eu pesquisar um pouco sobre {businessName}..."**
- Items sequenciais:
  - "Procurando na internet..."
  - "Analisando suas redes..."
  - "Entendendo seu mercado..."
  - "Quase lá..."
- Auto-avanço após sequência completa

---

## Etapa 3 — "Encontrei isso — está certo?"

Mesma lógica da etapa 3 do KeepBiz (validação de achados), mas com:

- Tom: **"Encontrei isso sobre o seu negócio — me diz se está certo?"**
- 5-6 achados mock (menos que o KeepBiz — experiência mais enxuta)
- Mesmos botões: Confirmar / Corrigir / Ignorar
- Mesma lógica de inline edit para correção
- CTA: "Tudo certo!" (habilitado quando todos revisados)

### Achados Mock (KeepSolo)

Baseados no negócio Cia Cuidadores:
- Nome encontrado: "Cia Cuidadores" (identidade)
- Segmento: "Cuidado domiciliar" (segmento)
- Concorrente: "Home Angels" (concorrente)
- Instagram encontrado: "@ciacuidadores" (rede_social)
- Localização: "São Paulo, SP" (dado_publico)

---

## Etapa 4 — "Pronto! Conheço seu negócio."

Tela de sucesso + resumo enxuto:

- Título: **"Pronto! Agora conheço o seu negócio."**
- Subtítulo: "Vou usar tudo isso pra criar conteúdo sob medida pra você."
- Card de resumo:
  - Nome do negócio
  - Segmento
  - Plataforma principal
- Select simples de tom de voz (formal/casual/amigável) — default: "amigável"
- Botão: **"Começar a usar"** → `completeOnboarding()` → navega para `/monitor`
- Confetti ou animação sutil de sucesso (opcional, mas impactante para o demo)

---

## Critérios de Aceite

1. [ ] Após login sem perfil configurado, redireciona automaticamente para `/onboarding`
2. [ ] `/onboarding` renderiza fullscreen (sem BottomNav/header)
3. [ ] Stepper de 4 dots com navegação funcional
4. [ ] Etapa 1: campos de coleta com tom pessoal, validação de nome
5. [ ] Etapa 2: loading animado com items sequenciais e auto-avanço
6. [ ] Etapa 3: achados mock com ações Confirmar/Corrigir/Ignorar
7. [ ] Etapa 3: correção inline funcional
8. [ ] Etapa 4: resumo + select de tom + botão "Começar a usar"
9. [ ] Após finalizar onboarding, flag persiste em localStorage
10. [ ] Após finalizar, navega para `/monitor` e BottomNav reaparece
11. [ ] Se revisitar `/onboarding` após completar, redireciona para `/monitor`
12. [ ] i18n: strings em pt/en/es
13. [ ] Identidade visual KeepSolo (amber/orange) aplicada
