# S-026 — KeepBiz: Wizard de Criação de Perfil

**Discoveries:** D-039, D-044, D-045
**Passada:** 3 (Wizard)
**Prioridade:** 10
**Depende de:** S-024, S-025

---

## Objetivo

Implementar o wizard de criação de perfil em 5 etapas no KeepBiz, seguindo o processo definido no TASK.md: coleta inicial → pesquisa do agente (loading) → validação de achados → estudo de nicho → resumo e finalização. O wizard é o coração do conceito de perfil — traduz a interação com o agente conversacional em UX concreta.

---

## Página (`src/pages/ProfileWizardPage.tsx`)

### Layout Geral

- Stepper horizontal no topo (5 etapas), mesmo padrão visual do `WorkflowWizard` existente
- Conteúdo da etapa ativa no centro
- Botões "Voltar" e "Avançar" no rodapé (ou "Finalizar" na última etapa)
- Largura máxima: `max-w-2xl` centralizado
- Suporta modo edição via query param `?edit=PRF-XXX` (pré-preenche campos)

### Stepper Labels

1. "Seu Negócio"
2. "Pesquisando..."
3. "Validação"
4. "Nicho & Posicionamento"
5. "Resumo"

---

## Etapa 1 — Coleta Inicial ("Seu Negócio")

Formulário com campos:

| Campo | Tipo | Obrigatório | Placeholder |
|---|---|---|---|
| Nome do negócio | text input | Sim | "Ex: Processa Sistemas" |
| URL do site | text input | Não | "https://seusite.com.br" |
| Redes sociais | repeater (platform select + handle input) | Não | — |

- Botão "Adicionar rede social" permite até 5 entradas
- Select de plataforma: Instagram, LinkedIn, TikTok, YouTube, Twitter/X, Facebook, WhatsApp, Google Meu Negócio
- Validação: nome do negócio não pode ser vazio
- Botão "Avançar" habilitado quando nome preenchido

---

## Etapa 2 — Pesquisa do Agente (Loading)

Tela de loading simulando pesquisa na internet:

- Animação: ícone `MagnifyingGlass` (Phosphor) com pulse + spinner circular
- Texto principal: **"Pesquisando na internet sobre {businessName}..."**
- Lista de status items que aparecem sequencialmente (1 a cada 1.5s):
  - "✓ Buscando informações públicas..."
  - "✓ Analisando redes sociais..."
  - "✓ Identificando concorrentes..."
  - "✓ Mapeando segmento de mercado..."
  - "✓ Análise concluída!"
- Após todos os items: delay de 1s, auto-avanço para etapa 3
- Sem botão manual — a transição é automática (simula processamento do agente)

---

## Etapa 3 — Validação de Achados

**Este é o diferencial mais sofisticado do wizard.** O agente mostra o que "descobriu" e o usuário valida.

### Dados Mock dos Achados

Gerar achados mock baseados no nome do negócio informado na etapa 1. Para o demo, usar um set fixo:

```ts
interface Finding {
  id: string
  category: 'identidade' | 'segmento' | 'concorrente' | 'rede_social' | 'dado_publico'
  label: string           // ex: "Segmento identificado"
  value: string           // ex: "Tecnologia — ERP para PMEs"
  status: 'pendente' | 'confirmado' | 'corrigido' | 'ignorado'
  correctedValue?: string // preenchido quando status = 'corrigido'
}
```

Set de 6-8 achados mock cobrindo:
- Nome encontrado no Google (identidade)
- Segmento de mercado identificado (segmento)
- 2 concorrentes identificados (concorrente)
- Redes sociais encontradas (rede_social)
- Dado público: número de funcionários, localização, etc. (dado_publico)

### UX de cada achado

```
┌───────────────────────────────────────────────┐
│ 🔍 Segmento identificado                     │
│ "Tecnologia — ERP para PMEs"                  │
│                                               │
│ [✓ Confirmar]  [✏️ Corrigir]  [✕ Ignorar]    │
└───────────────────────────────────────────────┘
```

- **Confirmar**: item fica com background verde claro, ícone check
- **Corrigir**: abre inline input abaixo do valor. Usuário digita correção → "Salvar correção". Item fica com background azul claro, mostra valor original riscado + valor corrigido
- **Ignorar**: item fica com background cinza, texto riscado
- Todos os 3 são toggle — o usuário pode mudar a decisão

### CTA de avanço

- Botão "Tudo certo, continuar" — habilitado quando **todos** os achados têm status ≠ 'pendente'
- Contador de pendentes: "X de Y itens revisados"

---

## Etapa 4 — Estudo de Nicho & Posicionamento

### Seleção de Segmento

Grid de cards (3 colunas desktop, 2 mobile) com segmentos de mercado:

- Saúde & Bem-estar
- Tecnologia
- Varejo
- Serviços B2B
- Educação
- Alimentação
- Finanças
- Indústria

Cada card: ícone + nome. Seleção única (radio behavior). O segmento identificado na etapa 3 vem pré-selecionado.

### Sub-opções de Público-Alvo

Após selecionar segmento, exibir 3-4 opções de público-alvo como chips selecionáveis (multi-select):

- Exemplo para "Tecnologia": "PMEs", "Startups", "Enterprise", "Governo"
- Exemplo para "Saúde & Bem-estar": "Famílias", "Idosos", "Profissionais de saúde", "Clínicas"

### Posicionamento

- Textarea com sugestão pré-preenchida pelo agente (texto mock baseado no segmento)
- Dois botões abaixo:
  - "Usar sugestão do agente" → mantém o texto (default)
  - "Escrever do meu jeito" → limpa o textarea para edição livre
- O texto original do agente é preservado em `positioning.agentSuggestion`

---

## Etapa 5 — Resumo e Finalização

Card com resumo visual de tudo que foi preenchido:

| Seção | Conteúdo |
|---|---|
| Identidade | Nome, URL, redes sociais |
| Segmento | Segmento + público-alvo selecionados |
| Posicionamento | Frase de posicionamento |
| Tom de voz | Select simples (formal/casual/técnico/inspiracional/amigável) + campo de exemplo |
| Plataformas | Checkboxes das plataformas onde o perfil atuará |

- Cada seção tem um link "Editar" que volta para a etapa correspondente
- Botão "Criar Perfil" no final
- Ao clicar: toast de sucesso "Perfil criado com sucesso!" + navega para `/profiles`
- No mock: adiciona o novo perfil ao state local (não persiste)

---

## Modo Edição

Quando acessado via `/profiles/new?edit=PRF-XXX`:

- Carrega dados do perfil existente nos campos
- Etapas 2 e 3 (loading + validação) são puladas — vai direto de etapa 1 para etapa 4
- Botão final: "Salvar Alterações" em vez de "Criar Perfil"

---

## Critérios de Aceite

1. [ ] Stepper horizontal com 5 etapas funciona (avanço, retorno, indicador de etapa ativa)
2. [ ] Etapa 1: campos de coleta funcionam, validação de nome obrigatório, repeater de redes sociais
3. [ ] Etapa 2: loading animado com items sequenciais e auto-avanço
4. [ ] Etapa 3: achados mock renderizam com ações Confirmar/Corrigir/Ignorar
5. [ ] Etapa 3: correção inline funciona (input aparece, valor original riscado)
6. [ ] Etapa 3: botão "Tudo certo" só ativa quando todos os achados foram revisados
7. [ ] Etapa 4: grid de segmentos com seleção única, sub-opções de público-alvo
8. [ ] Etapa 4: textarea de posicionamento com toggle "sugestão do agente" vs. "escrever do meu jeito"
9. [ ] Etapa 5: resumo completo com links para editar cada seção
10. [ ] Botão "Criar Perfil" mostra toast e navega para `/profiles`
11. [ ] Modo edição pula etapas 2 e 3, pré-preenche campos
12. [ ] i18n: strings em pt/en/es
13. [ ] Responsivo: wizard funcional no mobile
