# PRP-012 — Create (KeepSolo)

**Passada:** 3 — Zona 2: Conteúdo
**Specs:** S-012
**Discoveries:** D-017
**Prioridade:** 6

---

## Objetivo

Implementar a seção Create do KeepSolo — grid de cards de conteúdo com criação simplificada, workflow de 3 estados (Rascunho → Pronto → Publicado) e calendário mensal simples.

## Escopo

### Telas (`/create`)
- **Grid de cards**: thumbnail placeholder, título, status badge, canal
- **Status badges**: Rascunho (gray), Pronto (blue), Publicado (green)
- **"Criar post"**: Dialog simplificado com título, tipo, canal, briefing, data
- **Ações diretas**: botões "Aprovar" → pronto, "Publicar" → publicado

### Calendário (`/create/calendar`)
- View mensal simples
- Dots de status nos dias com conteúdo
- Click em item abre detail

## Features

1. **F-012-A**: Grid de cards de conteúdo — cards com thumbnail, título, status badge, canal
2. **F-012-B**: Dialog "Criar post" — form simplificado (título, tipo, canal, briefing, data) → adiciona com status "rascunho"
3. **F-012-C**: Ações de status — "Aprovar" muda para pronto, "Publicar" muda para publicado, badges atualizam em tempo real
4. **F-012-D**: Calendário mensal — grid de dias com dots de status, click em item abre detail
5. **F-012-E**: State management — Context para conteúdo, add/update persiste na sessão

## Limites

- NÃO implementar view semanal (→ apenas mensal)
- NÃO implementar swarm indicator (→ exclusivo KeepBiz)
- NÃO implementar editor rich-text
- Thumbnails são placeholders coloridos (assets OpenAI → PRP-014)

## Dependências

- **PRP-001** — dados mock (conteúdo)
- **PRP-003** — shell KeepSolo com rota `/create`
