# S-023 — OpenAI DALL-E: Hero Assets para Landing Pages

**Discoveries:** D-027
**Passada:** 2 (Landing Pages — pode ser executada em paralelo com S-018/S-019)
**Prioridade:** 9
**Depende de:** Nenhuma dependência técnica (os assets são referenciados pelas landings, mas podem ser gerados independentemente)

---

## Objetivo

Gerar imagens de hero de alto impacto para as landing pages de KeepBiz e KeepSolo usando a API OpenAI DALL-E. Os assets devem comunicar visualmente a proposta de valor de cada produto e ser salvos em `public/` para uso estático.

---

## API Configuration

```
OPENAI_API_KEY=  # ver .env na raiz do repositório
```

### Endpoint

```
POST https://api.openai.com/v1/images/generations
```

### Parâmetros recomendados

| Param | Valor |
|---|---|
| model | `dall-e-3` |
| size | `1792x1024` (landscape, ideal para hero) |
| quality | `hd` |
| n | `1` (DALL-E 3 só suporta 1 por request) |

---

## Assets a Gerar

### 1. Hero KeepBiz (`public/images/hero-keepbiz.png`)

**Prompt sugerido:**
> "A modern corporate office environment with a diverse team of professionals working alongside translucent holographic AI agents. The AI agents are represented as subtle blue-glowing digital assistants hovering near computer screens, helping with charts, reports, and communications. Clean, professional atmosphere with cool blue and gray tones. Wide landscape composition, photorealistic style with slight futuristic elements. No text in the image."

**Direção visual:** Ambiente corporativo moderno. Equipe humana + agentes digitais colaborando. Tons frios (azuis, cinzas). Sensação de controle e eficiência.

### 2. Hero KeepSolo (`public/images/hero-keepsolo.png`)

**Prompt sugerido:**
> "A confident solo entrepreneur working from a bright, warm home office with a laptop. Around them, friendly AI assistants represented as warm amber-glowing orbs are handling tasks: one sending messages on a phone, one organizing a calendar, one reviewing analytics on a floating screen. Warm color palette with amber, orange and natural light. Wide landscape composition, photorealistic style with slight futuristic elements. The entrepreneur looks relaxed and in control. No text in the image."

**Direção visual:** Solopreneur confiante. Agentes como orbes/assistentes amigáveis. Tons quentes (âmbar, laranja). Sensação de liberdade e resultado.

### 3. Assets adicionais (opcionais, se orçamento de API permitir)

- `public/images/section-how-it-works.png` — Ilustração do fluxo mapeamento → agente → resultado
- `public/images/testimonial-bg.png` — Background sutil para seção de depoimentos

---

## Script de Geração

Criar um script utilitário para gerar os assets:

```
scripts/generate-hero-assets.ts   (ou .mjs)
```

O script deve:
1. Ler a OPENAI_API_KEY de variável de ambiente ou hardcoded no script
2. Fazer 2 requests ao DALL-E (um por hero)
3. Baixar as imagens retornadas (URL temporária do DALL-E)
4. Salvar em `mocks/keep-biz/public/images/hero-keepbiz.png` e `mocks/keep-solo/public/images/hero-keepsolo.png`
5. Logar progresso no console

**Alternativa:** O agente coder pode gerar os assets inline usando `fetch` direto ou `curl`, sem necessidade de script permanente. O importante é que os arquivos PNG existam em `public/images/`.

---

## Fallback (sem imagem)

Se por qualquer motivo a geração falhar, as landing pages (S-018, S-019) devem ter um fallback visual:
- Gradient abstrato usando as cores do app (CSS `background: linear-gradient(...)`)
- Ícones Phosphor grandes e animados (Robot, Lightning, ShieldCheck)
- A landing funciona sem a imagem — o hero fica só texto + gradient + ícones

---

## Critérios de Aceite

1. [ ] Imagem hero KeepBiz gerada e salva em `mocks/keep-biz/public/images/hero-keepbiz.png`
2. [ ] Imagem hero KeepSolo gerada e salva em `mocks/keep-solo/public/images/hero-keepsolo.png`
3. [ ] Imagens em formato landscape (~1792x1024) com qualidade HD
4. [ ] Imagem KeepBiz transmite: corporativo, equipe, agentes digitais, tons frios
5. [ ] Imagem KeepSolo transmite: solopreneur, liberdade, agentes amigáveis, tons quentes
6. [ ] Sem texto dentro das imagens (DALL-E gera texto ilegível)
7. [ ] Landing pages referenciam as imagens com fallback CSS caso não existam
8. [ ] Script de geração funcional (mesmo que single-use)
