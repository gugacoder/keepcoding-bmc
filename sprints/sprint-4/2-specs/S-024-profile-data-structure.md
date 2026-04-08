# S-024 — Estrutura de Dados de Perfil

**Discoveries:** D-037
**Passada:** 1 (Dados)
**Prioridade:** 10
**Depende de:** —

---

## Objetivo

Criar a estrutura de dados mock de perfil em ambos os apps. O perfil contém toda a informação necessária para que o agente interno produza conteúdo: identidade do negócio, nicho, posicionamento, tom de voz e plataformas-alvo. KeepBiz usa um array de perfis (multi-perfil). KeepSolo usa um objeto único (perfil transparente).

---

## Tipos (`src/data/types.ts`)

Adicionar ao final do arquivo de tipos existente em cada app:

```ts
export type ProfileStatus = 'rascunho' | 'completo' | 'ativo' | 'inativo'

export interface ProfileIdentity {
  businessName: string
  url: string | null
  socialLinks: { platform: string; handle: string }[]
}

export interface ProfileNiche {
  segment: string            // ex: "Saúde & Bem-estar"
  targetAudience: string     // ex: "PMEs do setor de cuidados domiciliares"
  competitors: string[]      // ex: ["Marca X", "Marca Y"]
}

export interface ProfilePositioning {
  differentials: string[]    // ex: ["Atendimento humanizado", "Tecnologia on-premise"]
  statement: string          // frase de posicionamento livre
  agentSuggestion: string | null  // sugestão original do agente (preservada)
}

export type ToneOfVoice = 'formal' | 'casual' | 'tecnico' | 'inspiracional' | 'amigavel'

export interface ProfileTone {
  primary: ToneOfVoice
  examples: string[]         // frases de exemplo que definem o tom
}

export interface Profile {
  id: string                 // ex: "PRF-001"
  identity: ProfileIdentity
  niche: ProfileNiche
  positioning: ProfilePositioning
  tone: ProfileTone
  platforms: string[]        // ex: ["Instagram", "LinkedIn", "TikTok"]
  status: ProfileStatus
  completeness: number       // 0-100, calculado a partir de campos preenchidos
  createdAt: string
  updatedAt: string
}
```

Os tipos são idênticos em ambos os apps — o que muda é a estrutura de dados mock.

---

## Dados Mock — KeepBiz (`mocks/keep-biz/src/data/profiles.ts`)

Array com 2 perfis pré-criados (demonstra multi-perfil):

```ts
import type { Profile } from './types'

export const profiles: Profile[] = [
  {
    id: 'PRF-001',
    identity: {
      businessName: 'Processa Sistemas',
      url: 'https://processasistemas.com.br',
      socialLinks: [
        { platform: 'LinkedIn', handle: 'processa-sistemas' },
        { platform: 'Instagram', handle: '@processasistemas' },
      ],
    },
    niche: {
      segment: 'Tecnologia',
      targetAudience: 'PMEs que precisam de ERP e automação de processos',
      competitors: ['Totvs', 'Omie', 'Bling'],
    },
    positioning: {
      differentials: ['Implantação personalizada', 'Suporte local dedicado', 'ERP on-premise'],
      statement: 'O ERP que entende a realidade da PME brasileira.',
      agentSuggestion: 'Tecnologia de gestão sob medida para quem precisa de controle real.',
    },
    tone: {
      primary: 'tecnico',
      examples: [
        'Automatize seus processos com quem entende o chão de fábrica.',
        'Nosso ERP foi desenhado para a operação que você já tem.',
      ],
    },
    platforms: ['LinkedIn', 'Instagram', 'Google Meu Negócio'],
    status: 'ativo',
    completeness: 100,
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2026-03-15T14:30:00Z',
  },
  {
    id: 'PRF-002',
    identity: {
      businessName: 'Processa Academy',
      url: 'https://academy.processasistemas.com.br',
      socialLinks: [
        { platform: 'Instagram', handle: '@processaacademy' },
        { platform: 'YouTube', handle: 'ProcessaAcademy' },
      ],
    },
    niche: {
      segment: 'Educação & Tecnologia',
      targetAudience: 'Gestores de PME buscando capacitação em ferramentas digitais',
      competitors: ['Alura para Empresas', 'RD University'],
    },
    positioning: {
      differentials: ['Conteúdo focado em ERP', 'Certificação prática', 'Turmas ao vivo'],
      statement: 'Capacite sua equipe com quem implanta o sistema.',
      agentSuggestion: 'Treinamento que conecta tecnologia e operação na prática.',
    },
    tone: {
      primary: 'amigavel',
      examples: [
        'Aprenda na prática, com quem faz acontecer no dia a dia.',
        'Sua equipe merece dominar as ferramentas que usa.',
      ],
    },
    platforms: ['Instagram', 'YouTube', 'LinkedIn'],
    status: 'rascunho',
    completeness: 75,
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-03-28T11:00:00Z',
  },
]
```

Exportar em `data/index.ts`:
```ts
export { profiles } from './profiles'
```

---

## Dados Mock — KeepSolo (`mocks/keep-solo/src/data/profiles.ts`)

Objeto único. Exporta também um booleano `profileConfigured` que o AuthContext / RouteGuard consultará para decidir se redireciona ao onboarding.

```ts
import type { Profile } from './types'

export const soloProfile: Profile = {
  id: 'PRF-SOLO',
  identity: {
    businessName: 'Cia Cuidadores',
    url: 'https://ciacuidadores.com.br',
    socialLinks: [
      { platform: 'Instagram', handle: '@ciacuidadores' },
      { platform: 'WhatsApp', handle: '+5511999887766' },
    ],
  },
  niche: {
    segment: 'Saúde & Bem-estar',
    targetAudience: 'Famílias que precisam de cuidadores domiciliares qualificados',
    competitors: ['Home Angels', 'Acuidar'],
  },
  positioning: {
    differentials: ['Cuidadores certificados', 'Acompanhamento semanal', 'App de família'],
    statement: 'Cuidado profissional com o carinho de casa.',
    agentSuggestion: 'A ponte entre famílias e cuidadores de confiança.',
  },
  tone: {
    primary: 'amigavel',
    examples: [
      'Seu familiar merece o melhor cuidado — e você, tranquilidade.',
      'Cada cuidador é escolhido a dedo, porque confiança não se improvisa.',
    ],
  },
  platforms: ['Instagram', 'WhatsApp', 'Google Meu Negócio'],
  status: 'ativo',
  completeness: 100,
  createdAt: '2025-12-01T08:00:00Z',
  updatedAt: '2026-03-20T16:00:00Z',
}

/** Mock flag: trocar para false para simular first-run (onboarding) */
export const profileConfigured = true
```

Exportar em `data/index.ts`:
```ts
export { soloProfile, profileConfigured } from './profiles'
```

---

## Critérios de Aceite

1. [ ] Tipos `Profile`, `ProfileIdentity`, `ProfileNiche`, `ProfilePositioning`, `ProfileTone` adicionados a `types.ts` em ambos os apps
2. [ ] `profiles.ts` no KeepBiz exporta array com 2 perfis mock realistas (Processa Sistemas + Processa Academy)
3. [ ] `profiles.ts` no KeepSolo exporta `soloProfile` (Cia Cuidadores) e `profileConfigured` booleano
4. [ ] Dados re-exportados via `data/index.ts` em ambos os apps
5. [ ] Ambos os perfis usam nomes consistentes com os clientes piloto já presentes nos mock data existentes
6. [ ] TypeScript compila sem erros com os novos tipos
