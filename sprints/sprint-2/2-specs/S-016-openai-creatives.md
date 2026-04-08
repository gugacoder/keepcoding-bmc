# S-016 — OpenAI: Criativos Gerados para Mock

**Discoveries:** D-018
**Passada:** 4 (Enhancement)
**Prioridade:** 7
**Depende de:** S-001, S-011 (Content Forge), S-012 (Create)

---

## Objetivo

Usar a API OpenAI (DALL-E) para gerar assets visuais que populam os mocks: thumbnails de conteúdo, imagens de campanhas, avatares de agentes. Assets gerados por IA elevam a credibilidade do demo — a diferença entre um protótipo e um produto.

---

## Escopo

Gerar imagens estáticas que serão salvas em `public/images/` de cada app e referenciadas nos dados mock. Não é geração dinâmica em runtime — é build-time asset creation.

### Assets a Gerar

**Para Content Forge / Create (thumbnails de conteúdo):**
1. Thumbnail "Lançamento de verão" — imagem de produto/campanha vibrante, estilo post Instagram
2. Thumbnail "Behind the scenes" — imagem de bastidores, estilo story
3. Thumbnail "Black Friday" — imagem promocional com tons escuros e destaque
4. Thumbnail "Depoimento cliente" — imagem profissional, estilo LinkedIn

**Para Agentes (avatares):**
1. Avatar "Invoice Hunter" — ícone estilizado de robô financeiro
2. Avatar "Lead Nurturer" — ícone estilizado de robô de marketing
3. Avatar "Schedule Keeper" — ícone estilizado de robô de agenda
4. Avatar "Content Drafter" — ícone estilizado de robô criativo
5. Avatar "Meu Assistente" (KeepSolo) — ícone amigável, tom pessoal

**Para Monitor:**
1. Placeholder de logo para fontes de menção (opcional)

### Especificações DALL-E

- Modelo: `dall-e-3`
- Tamanho: 1024x1024 (square) para thumbnails, 512x512 para avatares
- Estilo: flat design, cores alinhadas com cada app
- Prompt pattern para thumbnails: "Flat design marketing thumbnail for {topic}, vibrant colors, modern, no text, clean composition"
- Prompt pattern para avatares: "Cute robot avatar for {role}, flat design, {warm|cool} colors, friendly, minimal"

---

## Implementação

### Script de Geração

Criar script `scripts/generate-assets.ts` (ou `.mjs`) na raiz do projeto que:

1. Lê um manifest de assets desejados
2. Chama a API OpenAI para cada asset
3. Salva as imagens em `mocks/keep-biz/public/images/` e `mocks/keep-solo/public/images/`
4. Atualiza referências nos dados mock

```ts
// Exemplo simplificado
const assets = [
  { name: 'thumb-summer-launch', prompt: '...', size: '1024x1024', dest: 'keep-biz' },
  { name: 'avatar-invoice-hunter', prompt: '...', size: '512x512', dest: 'keep-biz' },
  // ...
]

for (const asset of assets) {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: asset.prompt,
    n: 1,
    size: asset.size,
  })
  // Download and save to public/images/
}
```

### Referência nos Dados Mock

Atualizar os arquivos de dados mock para referenciar as imagens:

```ts
// data/content.ts
{ id: 'c-001', title: 'Lançamento de verão', thumbnail: '/images/thumb-summer-launch.png', ... }

// data/agents.ts
{ id: 'a-001', name: 'Invoice Hunter', avatar: '/images/avatar-invoice-hunter.png', ... }
```

### Variável de Ambiente

```
OPENAI_API_KEY=  # ver .env na raiz do repositório
```

---

## Fallback

Se a API não estiver disponível ou falhar, os dados mock devem funcionar com placeholder visual:
- Div colorida com iniciais ou ícone Phosphor no lugar da imagem
- O app nunca deve quebrar por falta de imagem

---

## Critérios de Aceite

1. [ ] Script de geração existe e é executável
2. [ ] 4+ thumbnails de conteúdo gerados e salvos em `public/images/`
3. [ ] 4-5 avatares de agentes gerados e salvos
4. [ ] Dados mock referenciam as imagens corretamente
5. [ ] Imagens renderizam nas telas de Content Forge, Create, e lista de agentes
6. [ ] Fallback visual funciona quando imagem não existe
7. [ ] Imagens são commitadas no repositório (não geradas em runtime)
