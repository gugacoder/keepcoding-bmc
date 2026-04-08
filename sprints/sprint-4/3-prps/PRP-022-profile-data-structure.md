# PRP-022 — Estrutura de Dados de Perfil

**Passada:** 4 — Perfil
**Specs:** S-024
**Discoveries:** D-037
**Prioridade:** 10

---

## Objetivo

Criar os tipos TypeScript e dados mock de perfil em ambos os apps (KeepBiz e KeepSolo). O perfil contém identidade do negócio, nicho, posicionamento, tom de voz e plataformas-alvo. KeepBiz usa array multi-perfil; KeepSolo usa objeto único com flag `profileConfigured`. Esta é a fundação de dados para todos os PRPs subsequentes do sprint 4.

## Escopo

### Tipos (`src/data/types.ts`) — ambos os apps

- `ProfileStatus`: union `'rascunho' | 'completo' | 'ativo' | 'inativo'`
- `ProfileIdentity`: nome do negócio, URL, redes sociais
- `ProfileNiche`: segmento, público-alvo, concorrentes
- `ProfilePositioning`: diferenciais, statement, sugestão do agente
- `ToneOfVoice`: union de 5 valores
- `ProfileTone`: tom primário + exemplos
- `Profile`: interface completa com id, identity, niche, positioning, tone, platforms, status, completeness, timestamps

### Mock Data — KeepBiz (`src/data/profiles.ts`)

Array com 2 perfis pré-criados:
- **PRF-001** — Processa Sistemas (Tecnologia, ativo, 100%)
- **PRF-002** — Processa Academy (Educação & Tecnologia, rascunho, 75%)

### Mock Data — KeepSolo (`src/data/profiles.ts`)

Objeto único `soloProfile`:
- **PRF-SOLO** — Cia Cuidadores (Saúde & Bem-estar, ativo, 100%)
- Booleano `profileConfigured` (default `true`, trocar para `false` para simular first-run)

### Exports (`data/index.ts`)

Re-exportar `profiles` (KeepBiz) e `soloProfile` + `profileConfigured` (KeepSolo).

## Features

1. **F-022-A**: Tipos de perfil em `types.ts` — adicionar `Profile`, `ProfileIdentity`, `ProfileNiche`, `ProfilePositioning`, `ProfileTone`, `ToneOfVoice`, `ProfileStatus` em ambos os apps
2. **F-022-B**: Mock data KeepBiz — `profiles.ts` com array de 2 perfis realistas (Processa Sistemas + Processa Academy), re-export em `data/index.ts`
3. **F-022-C**: Mock data KeepSolo — `profiles.ts` com `soloProfile` (Cia Cuidadores) e `profileConfigured` booleano, re-export em `data/index.ts`

## Limites

- NÃO criar contexto React — será feito nos PRPs que precisam (PRP-025, PRP-026)
- NÃO criar componentes de UI — apenas tipos e dados
- Nomes dos clientes mock devem ser consistentes com dados existentes nos apps

## Dependências

- Nenhuma — este é o PRP base do sprint 4
