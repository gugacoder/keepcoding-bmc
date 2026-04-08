# PRP-034 — Monitor: Insight da IA

**Passada:** 5 — Autocriação
**Specs:** S-042
**Discoveries:** D-058
**Prioridade:** 6

---

## Objetivo

Adicionar card de insight da IA nas MonitorPages de ambos os apps. O card exibe sugestões contextuais baseadas no "desempenho recente" (mock) e direciona o usuário para as sugestões de conteúdo. Fecha o loop de retroalimentação do ciclo de autocriação: análise → sugestão → criação.

## Escopo

### Componente `AiInsightCard` (`src/components/AiInsightCard.tsx`) — ambos os apps

- **Borda left** em violeta (4px), fundo sutil (`bg-violet-50` / dark: `bg-violet-950/20`)
- **Header**: ícone `Lightbulb` ou `Brain` + título "Baseado no seu desempenho recente"
- **Body**: 1-2 insights mock em bullet points
- **CTA**: botão link "Ver sugestões de conteúdo →" → navega para CreatePage (KeepSolo) ou ContentPage (KeepBiz)
- **Dismiss**: botão X no canto superior direito — ao fechar, card não reaparece na sessão (state local)

### Mock Insights — KeepSolo

- "Seu conteúdo de Instagram teve 3x mais engajamento esta semana — sugerindo mais posts para essa plataforma."
- "Posts publicados às terças-feiras performam 40% melhor. Considere agendar conteúdo para esse dia."

### Mock Insights — KeepBiz

- "O perfil Processa Sistemas teve 2x mais alcance no LinkedIn esta semana — sugerindo intensificar presença nessa plataforma."
- "Conteúdo do tipo carrossel gera 60% mais engajamento. O agente já preparou sugestões nesse formato."

### Localização nas Páginas

- **KeepSolo (`MonitorPage`)**: primeiro elemento da página, acima dos KPIs
- **KeepBiz (`MonitorPage`)**: acima do feed de menções / score de reputação; respeita ProfileSelector (insights mudam conforme perfil selecionado)

## Features

1. **F-034-A**: Componente `AiInsightCard` com visual diferenciado, insights mock e CTA de navegação
2. **F-034-B**: Integração na MonitorPage KeepSolo — acima dos KPIs, com dismiss funcional
3. **F-034-C**: Integração na MonitorPage KeepBiz — acima do feed, insights variam por perfil selecionado
4. **F-034-D**: Dismiss funcional (state local, não reaparece na sessão)

## Limites

- NÃO conectar a dados reais — insights são mock hardcoded
- NÃO persistir dismiss além da sessão (não sobrevive reload)
- NÃO alterar componentes existentes da MonitorPage

## Dependências

- **PRP-028** — campo `source` em ContentItem (para que o CTA faça sentido ao navegar)
