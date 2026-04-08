# S-040 — KeepBiz: Visão Consolidada de Sugestões por Perfil

**Discoveries:** D-056
**Passada:** 3 (Feature)
**Prioridade:** 7
**Depende de:** S-035

---

## Objetivo

Quando o ProfileSelector está em "Todos os perfis", a seção de sugestões da IA na ContentPage agrupa as sugestões por perfil com headers expandíveis. Permite ao gestor processar sugestões de todos os seus negócios sem alternar contexto.

---

## Layout

### Seção de Sugestões em modo "Todos os perfis"

Em vez de uma lista flat, agrupar por perfil:

```
┌─────────────────────────────────────────────┐
│ 🤖 Sugestões da IA (6 pendentes)            │
├─────────────────────────────────────────────┤
│ ▾ Processa Sistemas — 3 sugestões           │
│   [card] [card] [card]                      │
│                                             │
│ ▾ Processa Academy — 3 sugestões            │
│   [card] [card] [card]                      │
└─────────────────────────────────────────────┘
```

### Headers por Perfil

- Nome do perfil + contagem de sugestões pendentes
- Ícone de chevron para expandir/recolher (default: expandido)
- Click no header: toggle expand/collapse do grupo
- Visual: `text-sm font-medium text-muted-foreground`, separator line abaixo

### Contador Total

No header geral "Sugestões da IA": badge com total de sugestões pendentes de todos os perfis somados.

---

## Quando Perfil Específico Selecionado

Comportamento normal do S-035 — lista flat sem agrupamento, apenas sugestões do perfil selecionado.

---

## Critérios de Aceite

1. [ ] Modo "Todos os perfis": sugestões agrupadas por perfil com header
2. [ ] Headers expandíveis/recolhíveis (default expandido)
3. [ ] Contagem por perfil e total no header
4. [ ] Modo perfil específico: lista flat sem agrupamento
5. [ ] Aprovar/Rejeitar de um perfil não afeta as sugestões de outro
