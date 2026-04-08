# S-036 — Badge "Gerado pela IA" nos Cards de Conteúdo

**Discoveries:** D-052
**Passada:** 2 (Visual)
**Prioridade:** 9
**Depende de:** S-031

---

## Objetivo

Adicionar badge visual nos cards de conteúdo da lista principal que indica a origem: "IA" para conteúdo aprovado que veio de sugestão (`source: 'ai'`). Torna o diferencial de autocriação perceptível mesmo após a aprovação.

---

## Componente `SourceBadge`

Componente reutilizável em `src/components/SourceBadge.tsx` (em ambos os apps):

```tsx
interface SourceBadgeProps {
  source: ContentSource;
}
```

### Quando `source === 'ai'`:
- Ícone `Robot` (Phosphor, já importado no KeepBiz)
- Texto: "IA"
- Cor: violeta (`text-violet-600`, `bg-violet-100` / dark: `bg-violet-900/30`)
- Tamanho: pequeno (text-xs, px-2 py-0.5, rounded-full)

### Quando `source === 'manual'`:
- Sem badge (ou badge sutil opcional — ícone `PencilSimple`, texto "Você", cor cinza)
- Default: **não renderizar nada** para manual — o badge de IA é o destaque, manual é o padrão silencioso

---

## Integração

### KeepSolo — `CreatePage`

Nos cards da grid principal de conteúdo (lista de itens já aprovados/agendados/publicados):
- Posicionar `SourceBadge` no header do card, ao lado do status badge existente

### KeepBiz — `ContentPage`

Nos `ContentThumbnail` ou cards da lista/grid de conteúdo:
- Posicionar `SourceBadge` similar ao KeepSolo, ao lado dos badges existentes

---

## Critérios de Aceite

1. [ ] Componente `SourceBadge` criado em ambos os apps
2. [ ] Badge "IA" com ícone Robot + cor violeta aparece em conteúdo com `source: 'ai'`
3. [ ] Badge não aparece (ou aparece sutilmente) em conteúdo `source: 'manual'`
4. [ ] Badge visível nos cards da lista principal (não apenas na seção de sugestões)
5. [ ] Funcional em ambos os apps
6. [ ] Dark mode compatível
