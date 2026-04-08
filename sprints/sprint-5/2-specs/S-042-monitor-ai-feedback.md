# S-042 — Monitor: Sugestão de Ajuste Baseada em Dados

**Discoveries:** D-058
**Passada:** 4 (Enriquecimento)
**Prioridade:** 6
**Depende de:** S-031

---

## Objetivo

Adicionar card de insight da IA nas MonitorPages de ambos os apps. O card exibe sugestões contextuais baseadas no "desempenho recente" (mock) e direciona o usuário para as sugestões de conteúdo. Fecha o loop de retroalimentação do ciclo de autocriação: análise → sugestão → criação.

---

## Componente `AiInsightCard`

Componente em `src/components/AiInsightCard.tsx` de cada app:

### Layout

- **Borda left** em violeta (4px), fundo sutil (`bg-violet-50` / dark: `bg-violet-950/20`)
- **Header**: ícone `Lightbulb` ou `Brain` + título "Baseado no seu desempenho recente"
- **Body**: 1-2 insights mock em formato de bullet points
- **CTA**: botão link "Ver sugestões de conteúdo →" que navega para CreatePage (KeepSolo) ou ContentPage (KeepBiz)
- **Dismiss**: botão X no canto superior direito — ao fechar, card não reaparece na sessão (state local)

### Mock Insights — KeepSolo

```
• Seu conteúdo de Instagram teve 3x mais engajamento esta semana — sugerindo mais posts para essa plataforma.
• Posts publicados às terças-feiras performam 40% melhor. Considere agendar conteúdo para esse dia.
```

### Mock Insights — KeepBiz

```
• O perfil Processa Sistemas teve 2x mais alcance no LinkedIn esta semana — sugerindo intensificar presença nessa plataforma.
• Conteúdo do tipo carrossel gera 60% mais engajamento. O agente já preparou sugestões nesse formato.
```

---

## Localização na Página

### KeepSolo — `MonitorPage`

- Posicionar acima dos KPIs existentes, como primeiro elemento da página
- Aparece apenas quando há insights para mostrar (mock: sempre há, até ser dismissado)

### KeepBiz — `MonitorPage`

- Posicionar acima do feed de menções / score de reputação
- Respeita o ProfileSelector: insights mudam conforme o perfil selecionado (mock: trocar os textos)

---

## Critérios de Aceite

1. [ ] Card de insight da IA na MonitorPage de ambos os apps
2. [ ] Visual diferenciado (borda violeta, ícone, fundo)
3. [ ] 1-2 insights mock contextualmente relevantes por app
4. [ ] CTA navega para CreatePage/ContentPage
5. [ ] Botão dismiss funcional (state local, não reaparece na sessão)
6. [ ] KeepBiz: insights variam por perfil selecionado
7. [ ] i18n via chaves do S-041
