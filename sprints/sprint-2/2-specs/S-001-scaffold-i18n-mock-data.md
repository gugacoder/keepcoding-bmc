# S-001 — Scaffold dos Projetos + i18n + Dados Mock

**Discoveries:** D-001, D-002, D-003
**Passada:** 1 (Foundation)
**Prioridade:** 10 (pré-requisito absoluto)

---

## Objetivo

Criar a fundação técnica dos dois apps mock — KeepBiz e KeepSolo — incluindo scaffold Vite, sistema de i18n desde o dia zero, e dados mock realistas que alimentam todas as telas subsequentes. Sem esta spec, nenhuma outra pode ser implementada.

---

## Estrutura de Pastas

```
mocks/
├── keep-biz/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts (ou CSS-based Tailwind 4)
│   ├── components.json          # shadcn config
│   ├── public/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── i18n/
│   │   │   ├── index.ts          # i18next setup
│   │   │   ├── pt.json           # Português (default)
│   │   │   ├── en.json           # English
│   │   │   └── es.json           # Español
│   │   ├── data/                 # Dados mock
│   │   │   ├── workflows.ts
│   │   │   ├── agents.ts
│   │   │   ├── connectors.ts
│   │   │   ├── content.ts
│   │   │   ├── mentions.ts
│   │   │   └── team.ts
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── lib/
│   │   └── hooks/
│   └── data/                     # Static assets (images, etc.)
│
└── keep-solo/
    ├── (mesma estrutura acima, sem mentions.ts e team.ts)
    └── src/
        └── data/
            ├── workflows.ts
            ├── agents.ts
            ├── connectors.ts
            ├── content.ts
            └── leads.ts
```

---

## Stack & Setup

| Dependência | Versão |
|---|---|
| Vite | latest |
| React | 19 |
| TypeScript | 5.x |
| Tailwind CSS | 4 |
| shadcn/ui | via `npx shadcn@latest init --preset b43fNjKT2 --template vite --monorepo` |
| @phosphor-icons/react | latest |
| react-router-dom | 7 |
| i18next + react-i18next | latest |
| i18next-browser-languagedetector | latest |

### Setup Commands (por projeto)

```bash
cd mocks/keep-biz   # ou mocks/keep-solo
npm create vite@latest . -- --template react-ts
npm install
npx shadcn@latest init --preset b43fNjKT2 --template vite --monorepo
npm install @phosphor-icons/react react-router-dom i18next react-i18next i18next-browser-languagedetector
```

---

## i18n

### Configuração (`src/i18n/index.ts`)

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import pt from './pt.json'
import en from './en.json'
import es from './es.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { pt: { translation: pt }, en: { translation: en }, es: { translation: es } },
    fallbackLng: 'pt',
    interpolation: { escapeValue: false },
  })

export default i18n
```

### Estrutura dos arquivos de tradução

Namespaces por zona:
```json
{
  "common": { "save": "Salvar", "cancel": "Cancelar", "confirm": "Confirmar", "delete": "Excluir", "add": "Adicionar", "search": "Buscar", "filter": "Filtrar", "loading": "Carregando...", "noResults": "Nenhum resultado" },
  "nav": { "monitor": "Monitor", "content": "Conteúdo", "agents": "Agentes", "settings": "Configurações", "chat": "Chat", "connectors": "Conectores", "workflows": "Workflows" },
  "monitor": { ... },
  "content": { ... },
  "agents": { ... },
  "settings": { ... }
}
```

- Default: `pt` (Português)
- Seletor de idioma: componente `LanguageSwitcher` acessível no header e nas configurações
- Dados mock NÃO são traduzidos — nomes de empresas, leads, etc. ficam no idioma original

---

## Dados Mock

Todos os dados devem ser exportados como arrays tipados com TypeScript interfaces. Os dados devem ser realistas e próximos dos clientes piloto (Processa Sistemas, Cia Cuidadores).

### Workflows (`src/data/workflows.ts`)

```ts
export interface Workflow {
  id: string
  name: string
  department?: string        // KeepBiz only
  status: 'mapeado' | 'app em criação' | 'app pronto' | 'implantado' | 'agente treinando' | 'agente ativo'
  agentId?: string
  createdAt: string          // ISO date
}
```

**KeepBiz — 5 workflows:**
1. `"Registro de chamadas → Google Sheets"` — Atendimento — mapeado
2. `"Follow-up de leads por email"` — Marketing — app pronto
3. `"Conciliação bancária semanal"` — Financeiro — agente ativo
4. `"Agendamento de reuniões"` — RH — implantado
5. `"Controle de estoque"` — Operações — agente treinando

**KeepSolo — 3 workflows:**
1. `"Follow-up de clientes por WhatsApp"` — mapeado
2. `"Agendamento de consultas"` — agente ativo
3. `"Cobrança de inadimplentes"` — app pronto

### Agentes (`src/data/agents.ts`)

```ts
export interface Agent {
  id: string
  name: string
  role: string
  department?: string        // KeepBiz only
  status: 'idle' | 'working' | 'waiting'
  heartbeat: boolean
  avatar?: string
  memoryItems: MemoryItem[]
  activities: Activity[]
  trainingProgress: number   // 0-100
  chatResponses: string[]    // Pool de 5-8 respostas contextuais
}

export interface MemoryItem {
  id: string
  category: 'operações' | 'preferências' | 'regras'
  text: string
}

export interface Activity {
  id: string
  action: string
  timestamp: string
  result: 'success' | 'warning' | 'error'
}
```

**KeepBiz — 4 agentes:**
1. `"Invoice Hunter"` — Financeiro — working — heartbeat ativo — training 100%
2. `"Lead Nurturer"` — Marketing — idle — heartbeat ativo — training 85%
3. `"Schedule Keeper"` — RH — working — heartbeat ativo — training 100%
4. `"Content Drafter"` — Marketing — waiting — heartbeat inativo — training 60%

**KeepSolo — 1 agente:**
1. `"Meu Assistente"` — generalista — working — heartbeat ativo — training 90%

Cada agente deve ter 5-8 `chatResponses` contextuais à sua role (não genéricas).

### Conectores (`src/data/connectors.ts`)

```ts
export interface Connector {
  id: string
  name: string
  icon: string               // Phosphor icon name
  category: 'produtividade' | 'comunicação' | 'finanças' | 'crm' | 'automação'
  connected: boolean
  configFields?: { label: string; type: 'text' | 'password' | 'oauth' }[]
}
```

**6 conectores:**
1. Google Workspace — produtividade — conectado
2. Microsoft 365 — produtividade — conectado
3. WhatsApp Business — comunicação — conectado
4. Slack — comunicação — desconectado
5. Trello — produtividade — desconectado
6. ERP Processa — automação — conectado (via MCP)

### Conteúdo (`src/data/content.ts`)

```ts
export interface ContentItem {
  id: string
  title: string
  type: 'post' | 'short' | 'criativo' | 'campanha'
  platform: string
  status: 'rascunho' | 'em revisão' | 'aprovado' | 'publicado' | 'agendado'
  author?: string            // KeepBiz only
  briefing?: string
  targetDate: string
  createdAt: string
  statusHistory: { status: string; date: string }[]
}
```

**3+ itens:**
1. `"Post: Lançamento de verão"` — post — Instagram — aprovado
2. `"Short: Behind the scenes"` — short — TikTok — em revisão
3. `"Campanha: Black Friday"` — campanha — Multi — rascunho
4. `"Criativo: Depoimento cliente"` — criativo — LinkedIn — publicado

### Menções — KeepBiz only (`src/data/mentions.ts`)

```ts
export interface Mention {
  id: string
  text: string
  source: 'twitter' | 'google-reviews' | 'instagram' | 'facebook' | 'forum'
  sentiment: 'positive' | 'neutral' | 'negative'
  date: string
  author: string
}
```

**5-8 menções** com sentimento variado.

### Leads — KeepSolo only (`src/data/leads.ts`)

```ts
export interface Lead {
  id: string
  name: string
  email: string
  origin: string
  funnelStage: 'visitante' | 'lead' | 'contato' | 'cliente'
  date: string
  phone?: string
  notes?: string
}
```

**8-10 leads** com distribuição variada nas etapas do funil.

### Equipe — KeepBiz only (`src/data/team.ts`)

```ts
export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'operador' | 'viewer'
  avatar?: string
  joinedAt: string
}
```

**4-5 membros** com roles variados.

---

## Critérios de Aceite

1. [ ] `cd mocks/keep-biz && npm run dev` inicia sem erros e renderiza a página raiz
2. [ ] `cd mocks/keep-solo && npm run dev` inicia sem erros e renderiza a página raiz
3. [ ] shadcn/ui está configurado e pelo menos um componente (Button) funciona em ambos os projetos
4. [ ] Phosphor Icons renderizam em ambos os projetos
5. [ ] React Router está configurado com pelo menos uma rota raiz em cada app
6. [ ] i18next inicializa com default `pt`, e `useTranslation()` funciona em um componente de teste
7. [ ] Componente `LanguageSwitcher` troca idioma e as strings traduzidas refletem a troca
8. [ ] Todos os arquivos de dados mock existem, exportam arrays tipados, e contêm dados realistas
9. [ ] Os tipos TypeScript dos dados mock estão corretos (`npm run typecheck` — se configurado — ou sem erros no editor)
10. [ ] Tailwind 4 classes funcionam nos componentes
