# S-012 — Create (KeepSolo)

**Discoveries:** D-017
**Passada:** 3 (Zona 2 — Conteúdo)
**Prioridade:** 6
**Depende de:** S-001, S-003

---

## Objetivo

Implementar a seção Create do KeepSolo — versão pessoal e simplificada do Content Forge. Grid de cards com status, criação via dialog, aprovação e publicação com badge update, calendário simples mensal.

---

## Grid de Conteúdo (`/create`)

Cards em grid responsivo (2 cols mobile, 3 cols desktop):

Cada card:
```
┌─────────────────────┐
│ 🖼 (thumbnail area) │
│                     │
│ Lançamento de verão │
│ Instagram  ● Pronto │
│ 12 mar 2026         │
└─────────────────────┘
```

- Thumbnail: placeholder colorido ou ícone por tipo
- Título
- Canal (plataforma) com ícone
- Status badge
- Data

### Status Badges

| Status | Cor | Ação disponível |
|---|---|---|
| Rascunho | gray | Aprovar |
| Pronto | blue | Publicar |
| Publicado | green | — |

(Simplificado vs KeepBiz: 3 estados em vez de 5)

---

## Dialog de Criação (`/create/new`)

Campos simplificados:
- **Título**: text input (obrigatório)
- **Tipo**: select (Post, Short, Criativo)
- **Canal**: select (Instagram, TikTok, LinkedIn, WhatsApp)
- **Briefing**: textarea (opcional)
- **Data**: date picker

Ao submeter:
1. Novo card aparece no grid com status "rascunho"
2. Dialog fecha

Sem campo "Autor" (é sempre o solopreneur).

---

## Ações nos Cards

Click no card abre detail (Sheet ou page):

- **"Aprovar"**: rascunho → pronto (badge muda em tempo real)
- **"Publicar"**: pronto → publicado (badge muda)
- Badges atualizam imediatamente no grid ao voltar

---

## Calendário Simples (`/create/calendar`)

- View mensal apenas (sem toggle semanal)
- Grid de dias com dots indicando posts
- Cor do dot: reflete status (gray/blue/green)
- Click em dot: abre detail do item
- Mobile-friendly: scroll horizontal se necessário

---

## Critérios de Aceite

1. [ ] Grid de cards renderiza com dados mock
2. [ ] Cards mostram thumbnail, título, canal, status, data
3. [ ] "Criar post" abre dialog simplificado
4. [ ] Ao submeter, novo card aparece com status "rascunho"
5. [ ] "Aprovar" muda status para "pronto" com badge update
6. [ ] "Publicar" muda status para "publicado" com badge update
7. [ ] Calendário mensal renderiza com dots por status
8. [ ] Click no dot do calendário abre detail
9. [ ] Layout responsivo: 2 cols (mobile) → 3 cols (desktop)
10. [ ] Visual coerente com identidade KeepSolo (cores quentes, rounded)
