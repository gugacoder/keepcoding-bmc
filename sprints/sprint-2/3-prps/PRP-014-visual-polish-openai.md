# PRP-014 — Identidade Visual, Estados, Responsividade & OpenAI Criativos

**Passada:** 4 — Admin & Polish
**Specs:** S-015, S-016
**Discoveries:** D-023, D-024, D-018
**Prioridade:** 7

---

## Objetivo

Aplicar polish final em ambos os apps: identidades visuais distintas (corporativo vs pessoal), responsividade mobile-first real, empty states educativos, loading skeletons, transições suaves, dark mode e assets visuais gerados via OpenAI DALL-E.

## Escopo

### Identidade Visual

| Aspecto | KeepBiz | KeepSolo |
|---------|---------|----------|
| Paleta | Slate/blue (fria) | Amber/orange (quente) |
| Border radius | 6px (rounded-md) | 12-16px (rounded-xl) |
| Padding | 12-16px (density alta) | 16-24px (generoso) |
| Densidade | Alta, mais informação visível | Baixa, mais espaço |
| Sidebar | Sim (desktop) | Não |
| Bottom nav | Mobile only | Always |

### Responsividade
- **Breakpoints**: 640px (sm), 1024px (lg)
- **Touch targets**: mínimo 48px
- **Mobile**: bottom nav acessível, thumb zones, cards não apertados
- **Desktop**: sidebar (KeepBiz), painéis lado a lado, tabelas expandidas

### Estados e Transições
- **Empty states**: ilustração simples + texto educativo + CTA (para listas vazias)
- **Loading skeletons**: durante delays do pipeline, carregamento de dados
- **Transições**: 150-300ms ease para mudanças de estado/rota
- **Heartbeat pulsante**: 3 rings animados em CSS (contínuo para agentes ativos)
- **Ícones**: Phosphor duotone consistente em todo o app

### Dark Mode
- Toggle no header ou settings
- Preferência salva em localStorage
- Cores adaptadas para ambas as identidades visuais

### OpenAI Criativos
- **Script de geração** (`scripts/generate-assets.ts`): usa DALL-E 3 para gerar assets em build-time
- **4 thumbnails de conteúdo**: imagens para Content Forge e Create (1024x1024)
- **5 avatars de agentes**: imagens para Agent Core e Meu Agente (512x512)
- **Fallback**: divs coloridos com iniciais/ícones se imagens indisponíveis
- Assets salvos em `public/images/`

## Features

1. **F-014-A**: Tokens de design KeepBiz — CSS custom properties para paleta fria, aplicar em todo o app
2. **F-014-B**: Tokens de design KeepSolo — CSS custom properties para paleta quente, aplicar em todo o app
3. **F-014-C**: Responsividade mobile KeepBiz — bottom nav mobile, sidebar colapsível, tabelas → cards em mobile
4. **F-014-D**: Responsividade mobile KeepSolo — bottom nav, cards adaptáveis, touch targets 48px
5. **F-014-E**: Empty states — componente reutilizável (ilustração + texto + CTA), aplicar em todas as listas
6. **F-014-F**: Loading skeletons — componente skeleton, aplicar no pipeline de deploy e carregamentos
7. **F-014-G**: Transições suaves — CSS transitions 150-300ms em mudanças de estado e navegação
8. **F-014-H**: Animação heartbeat — 3 rings CSS keyframes, reutilizar em lista de agentes e pipeline
9. **F-014-I**: Dark mode — toggle, localStorage, variáveis CSS para ambos os themes
10. **F-014-J**: Script de geração OpenAI — DALL-E 3, gerar thumbnails e avatars, salvar em public/
11. **F-014-K**: Integrar assets OpenAI — referenciar imagens nos dados mock, fallback com iniciais

## Limites

- NÃO redesenhar layouts existentes — apenas refinar cores, espaçamentos e transições
- NÃO adicionar novas funcionalidades — apenas polish visual
- Script OpenAI é executado manualmente (build-time), não em runtime
- Dark mode é cosmético — pode ter imperfeições em componentes shadcn

## Dependências

- **Todos os PRPs anteriores** — polish é aplicado sobre funcionalidades existentes
- **PRP-001** — dados mock (para referenciar assets gerados)
- Requer `OPENAI_API_KEY` do TASK.md para geração de assets
