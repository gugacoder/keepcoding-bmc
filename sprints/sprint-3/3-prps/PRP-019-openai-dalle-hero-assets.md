# PRP-019 — OpenAI DALL-E: Hero Assets para Landing Pages

**Passada:** 2 — Landing Pages (executável em paralelo com PRP-017/PRP-018)
**Specs:** S-023
**Discoveries:** D-027
**Prioridade:** 9

---

## Objetivo

Gerar imagens de hero de alto impacto para as landing pages de KeepBiz e KeepSolo usando a API OpenAI DALL-E 3. Os assets devem comunicar visualmente a proposta de valor de cada produto e ser salvos em `public/images/` para uso estático nas landing pages.

## Escopo

### Assets a Gerar
1. **Hero KeepBiz** (`mocks/keep-biz/public/images/hero-keepbiz.png`): ambiente corporativo moderno com equipe + agentes digitais, tons frios (azuis, cinzas), 1792x1024 landscape HD
2. **Hero KeepSolo** (`mocks/keep-solo/public/images/hero-keepsolo.png`): solopreneur confiante com agentes amigáveis (orbes amber), tons quentes, 1792x1024 landscape HD
3. **Assets opcionais**: `section-how-it-works.png`, `testimonial-bg.png` (se orçamento de API permitir)

### API
- Endpoint: `POST https://api.openai.com/v1/images/generations`
- Model: `dall-e-3`, size: `1792x1024`, quality: `hd`, n: `1`
- OPENAI_API_KEY disponível no TASK.md

### Script de Geração
- `scripts/generate-hero-assets.ts` (ou `.mjs`): lê API key, faz 2 requests, baixa e salva PNGs
- Alternativa: o agente coder pode gerar via `fetch`/`curl` inline

### Prompts Sugeridos
- **KeepBiz**: "A modern corporate office environment with a diverse team of professionals working alongside translucent holographic AI agents. The AI agents are represented as subtle blue-glowing digital assistants hovering near computer screens... Cool blue and gray tones. Wide landscape, photorealistic with slight futuristic elements. No text in the image."
- **KeepSolo**: "A confident solo entrepreneur working from a bright, warm home office with a laptop. Around them, friendly AI assistants represented as warm amber-glowing orbs are handling tasks... Warm color palette with amber, orange and natural light. Wide landscape, photorealistic. No text in the image."

### Fallback
- Se geração falhar, landing pages usam gradient CSS + ícones Phosphor animados (já previsto em PRP-017/PRP-018)

## Features

1. **F-019-A**: Script de geração — script que usa DALL-E 3 API para gerar 2 imagens hero (KeepBiz + KeepSolo) e salvar em `public/images/`
2. **F-019-B**: Imagem hero KeepBiz — gerar via DALL-E com prompt corporativo, tons frios, landscape HD, salvar em `mocks/keep-biz/public/images/hero-keepbiz.png`
3. **F-019-C**: Imagem hero KeepSolo — gerar via DALL-E com prompt pessoal, tons quentes, landscape HD, salvar em `mocks/keep-solo/public/images/hero-keepsolo.png`
4. **F-019-D**: Validação — verificar que imagens existem, formato correto, sem texto ilegível, e que landing pages referenciam com fallback CSS

## Limites

- NÃO modificar as landing pages — apenas gerar os assets que elas referenciam
- Script é single-use (executado manualmente em build-time, não em runtime)
- Sem texto dentro das imagens (DALL-E gera texto ilegível)
- Máximo 2 requests obrigatórios ao DALL-E (assets opcionais dependem de orçamento)

## Dependências

- Nenhuma dependência técnica — pode ser executado em paralelo com qualquer PRP
- Requer `OPENAI_API_KEY` do TASK.md
