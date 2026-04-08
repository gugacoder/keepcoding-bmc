# S-038 — Indicador de Atividade do Agente

**Discoveries:** D-054
**Passada:** 3 (Polimento)
**Prioridade:** 8
**Depende de:** S-031, S-032

---

## Objetivo

Adicionar indicadores visuais que comunicam ao usuário que o agente está ativo e criando conteúdo. A narrativa de autonomia depende de elementos que façam o sistema parecer vivo — sem eles, o usuário só descobre as sugestões navegando manualmente.

---

## KeepBiz — Orchestrator Bar

A Orchestrator Bar (`src/components/OrchestratorBar.tsx`) já exibe "Swarm ativo" com ícone bolt.

### Alteração

Quando existem sugestões pendentes (`source: 'ai'`, `status: 'rascunho'`):

- Adicionar texto animado ao lado do swarm status: **"Agente criou X sugestões"**
- Ícone `Sparkle` com animação pulse sutil
- Contagem `X` = número de ContentItems com `source === 'ai' && status === 'rascunho'`
- Clique no texto: navega para a ContentPage (onde as sugestões estão)
- Quando não há sugestões pendentes: o indicador não aparece (volta ao estado atual)

---

## KeepSolo — Bottom Nav Badge

O bottom nav (`src/components/BottomNav.tsx`) tem 3 rooms: Monitor, Criar, Agentes.

### Alteração

No ícone do room "Criar":

- Badge numérico (circle vermelho/amber) com contagem de sugestões AI pendentes
- Badge aparece apenas quando `count > 0`
- Estilo: mesma convenção de notification badges (circle com número, posição top-right do ícone)
- Ao navegar para CreatePage e visualizar as sugestões, o badge permanece enquanto houver sugestões não processadas

---

## Critérios de Aceite

1. [ ] KeepBiz: Orchestrator Bar mostra "Agente criou X sugestões" quando há sugestões pendentes
2. [ ] KeepBiz: ícone Sparkle com pulse
3. [ ] KeepBiz: clique navega para ContentPage
4. [ ] KeepBiz: indicador desaparece quando count === 0
5. [ ] KeepSolo: badge numérico no ícone "Criar" do bottom nav
6. [ ] KeepSolo: badge desaparece quando count === 0
7. [ ] Contagens são reativas ao estado do `useContentActions`
