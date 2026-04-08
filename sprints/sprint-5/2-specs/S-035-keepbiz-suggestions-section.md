# S-035 — KeepBiz: Seção "Sugestões da IA" na ContentPage

**Discoveries:** D-051
**Passada:** 2 (Telas)
**Prioridade:** 9
**Depende de:** S-031, S-032, S-034

---

## Objetivo

Adicionar seção de sugestões de IA na ContentPage do KeepBiz, integrada com o ProfileSelector existente. Quando um perfil está selecionado, exibe apenas sugestões desse perfil. Quando "Todos os perfis", agrupa por perfil.

---

## Localização

`mocks/keep-biz/src/pages/ContentPage.tsx` — seção inserida acima da lista/grid de conteúdo existente, abaixo do ProfileSelector.

---

## Layout

### Seção "Sugestões da IA"

- **Header**: ícone `Robot` + "Sugestões da IA" + badge contagem + link "Ver todas" (se truncado)
- **Visibilidade**: renderiza apenas quando existem itens `source === 'ai'` e `status === 'rascunho'` para o perfil selecionado (ou qualquer perfil se "Todos")
- **Desktop**: grid 3 colunas (alinhado ao layout da ContentPage)
- **Mobile**: scroll horizontal com snap

### Integração com ProfileSelector

- **Perfil específico selecionado**: filtra sugestões por `profileId` — exibe apenas as daquele perfil
- **"Todos os perfis"**: exibe todas as sugestões, com badge do nome do perfil em cada card (usa dados de `profiles.ts`)

### Card de Sugestão

Reutiliza o padrão do `AiSuggestionCard` (mesmo do KeepSolo, S-033), com adições:

- **Badge de perfil**: nome do perfil no canto inferior (ex: "Processa Sistemas") — visível principalmente no modo "Todos os perfis"
- **Mesmos 3 botões**: Aprovar / Editar / Rejeitar (conectados ao `useContentActions` do S-034)
- **Visual**: borda left em azul/violeta (cores frias do KeepBiz, não amber)

---

## Separador

Divider "Conteúdo existente" entre seção de sugestões e lista principal.

---

## Critérios de Aceite

1. [ ] Seção "Sugestões da IA" aparece na ContentPage acima da lista existente
2. [ ] Filtragem por perfil funciona quando ProfileSelector está ativo
3. [ ] Modo "Todos os perfis": exibe sugestões de todos os perfis com badge de nome
4. [ ] Seção desaparece quando não há sugestões pendentes
5. [ ] Cards com visual diferenciado (borda, badge IA, fundo) em estilo KeepBiz (frio)
6. [ ] Botões Aprovar/Editar/Rejeitar funcionais (via S-034)
7. [ ] Mobile: scroll horizontal; Desktop: grid 3 colunas
8. [ ] Badge de perfil visível nos cards
