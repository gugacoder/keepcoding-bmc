# PRP-027 — KeepSolo: Edição de Perfil em Config

**Passada:** 4 — Perfil
**Specs:** S-030
**Discoveries:** D-043
**Prioridade:** 8

---

## Objetivo

Adicionar a seção "Meu Negócio" na ConfigPage do KeepSolo, permitindo que o usuário edite as informações do perfil coletadas no onboarding. O TASK.md define que o perfil deve estar disponível para modificação a qualquer momento — esta tela garante essa autonomia.

## Escopo

### Componente (`src/components/BusinessProfileSection.tsx`)

Seção de formulário inserida como **primeira seção** da ConfigPage existente (acima de Perfil Pessoal).

### Campos

| Campo | Tipo | Fonte no Profile |
|---|---|---|
| Nome do negócio | text input | `identity.businessName` |
| Segmento | select (8 opções, mesmas do wizard) | `niche.segment` |
| Público-alvo | text input | `niche.targetAudience` |
| Posicionamento | textarea | `positioning.statement` |
| Tom de voz | select (formal/casual/técnico/inspiracional/amigável) | `tone.primary` |
| Plataformas ativas | checkbox group | `platforms` |
| Redes sociais | repeater (plataforma + handle) | `identity.socialLinks` |

### Indicador de Completude

- No header da seção, à direita do título "Meu Negócio"
- Progress bar + percentual numérico
- Cores: red < 50%, yellow < 80%, green >= 80%
- Cálculo: campos preenchidos / total de campos × 100

### Comportamento

- Campos pré-preenchidos com dados de `soloProfile` via `SoloProfileContext`
- Botão "Salvar alterações" → `updateProfile(formData)` → toast "Alterações salvas!"
- Mock: atualiza state em memória (não persiste reload)

## Features

1. **F-027-A**: BusinessProfileSection — seção com todos os campos listados, pré-preenchidos via ProfileContext
2. **F-027-B**: Integração na ConfigPage — inserir como primeira seção, acima de Perfil Pessoal
3. **F-027-C**: Indicador de completude — progress bar + % no header da seção com cores por faixa
4. **F-027-D**: Salvar alterações — botão que chama `updateProfile()` no context e mostra toast de confirmação
5. **F-027-E**: i18n — strings da seção em pt/en/es

## Limites

- NÃO persistir alterações além do state (não sobrevive a reload)
- NÃO alterar o wizard de onboarding — esta seção é independente
- ConfigPage só é acessível pós-onboarding, então campos nunca estarão desabilitados

## Dependências

- **PRP-022** — tipos `Profile` e mock data
- **PRP-026** — `SoloProfileContext` com método `updateProfile` deve existir
