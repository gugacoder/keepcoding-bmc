# S-030 — KeepSolo: Edição de Perfil em Config

**Discoveries:** D-043
**Passada:** 5 (Config)
**Prioridade:** 8
**Depende de:** S-024, S-029

---

## Objetivo

Adicionar seção "Meu Negócio" na `ConfigPage` do KeepSolo, permitindo que o usuário edite as informações do perfil coletadas no onboarding. O TASK.md define que o perfil deve estar disponível para modificação a qualquer momento.

---

## Integração na ConfigPage

A `ConfigPage` já existe com seções: Perfil Pessoal, Notificações, Plano, Idioma. Adicionar a seção **"Meu Negócio"** como **primeira seção** da página (acima de Perfil Pessoal), já que é o conteúdo mais relevante para o solopreneur.

---

## Seção "Meu Negócio" (`src/components/BusinessProfileSection.tsx`)

### Layout

```
┌───────────────────────────────────────────────────┐
│  Meu Negócio                          85% ████░  │
├───────────────────────────────────────────────────┤
│                                                   │
│  Nome do negócio                                  │
│  [Cia Cuidadores                           ]     │
│                                                   │
│  Segmento                                         │
│  [Saúde & Bem-estar                  ▾]          │
│                                                   │
│  Público-alvo                                     │
│  [Famílias que precisam de cuidadores...]        │
│                                                   │
│  Posicionamento                                   │
│  [Cuidado profissional com o carinho  ]          │
│  [de casa.                            ]          │
│                                                   │
│  Tom de voz                                       │
│  [Amigável                           ▾]          │
│                                                   │
│  Plataformas ativas                               │
│  [✓] Instagram  [✓] WhatsApp  [ ] LinkedIn       │
│  [ ] TikTok     [ ] YouTube   [ ] Blog            │
│                                                   │
│  Redes sociais                                    │
│  Instagram: @ciacuidadores        [✏️]           │
│  WhatsApp: +5511999887766         [✏️]           │
│  [+ Adicionar rede]                               │
│                                                   │
│  [Salvar alterações]                              │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Campos

| Campo | Tipo | Fonte |
|---|---|---|
| Nome do negócio | text input | `identity.businessName` |
| Segmento | select (mesmas opções da etapa 4 do wizard) | `niche.segment` |
| Público-alvo | text input | `niche.targetAudience` |
| Posicionamento | textarea | `positioning.statement` |
| Tom de voz | select (formal/casual/técnico/inspiracional/amigável) | `tone.primary` |
| Plataformas ativas | checkbox group | `platforms` |
| Redes sociais | repeater (platform + handle) | `identity.socialLinks` |

### Indicador de Completude

- No header da seção, à direita do título "Meu Negócio"
- Progress bar visual + percentual numérico
- Cálculo: campos preenchidos / total de campos × 100
- Cores: red < 50%, yellow < 80%, green >= 80%

### Comportamento

- Campos pré-preenchidos com dados de `soloProfile` (via `ProfileContext`)
- Botão "Salvar alterações" → `updateProfile(formData)` via context → toast "Alterações salvas!"
- Mock: atualiza state em memória (não persiste reload)
- Campos desabilitados se `isConfigured === false` (nunca deve acontecer — ConfigPage só é acessível pós-onboarding)

---

## Critérios de Aceite

1. [ ] Seção "Meu Negócio" renderiza como primeira seção da ConfigPage
2. [ ] Todos os campos listados estão presentes e pré-preenchidos com dados do perfil
3. [ ] Select de segmento exibe as mesmas opções do wizard
4. [ ] Select de tom de voz exibe 5 opções
5. [ ] Checkbox group de plataformas funciona (toggle individual)
6. [ ] Repeater de redes sociais permite adicionar/remover
7. [ ] Indicador de completude (%) exibe no header da seção
8. [ ] Botão "Salvar alterações" mostra toast de confirmação
9. [ ] i18n: strings em pt/en/es
10. [ ] Identidade visual KeepSolo (amber/orange) aplicada
