# PRP-024 — KeepBiz: Wizard de Criação de Perfil

**Passada:** 4 — Perfil
**Specs:** S-026
**Discoveries:** D-039, D-044, D-045
**Prioridade:** 10

---

## Objetivo

Implementar o wizard de criação de perfil em 5 etapas no KeepBiz, traduzindo o processo do TASK.md em UX concreta: coleta inicial → pesquisa simulada do agente → validação de achados → estudo de nicho & posicionamento → resumo e finalização. Este é o componente central do conceito de perfil — demonstra a interação entre agente e usuário na construção do perfil.

## Escopo

### Telas / Componentes

- **ProfileWizardPage** (`src/pages/ProfileWizardPage.tsx`): página fullscreen com stepper de 5 etapas, conteúdo da etapa ativa e botões Voltar/Avançar
- **WizardStepIdentity** (`src/components/wizard/WizardStepIdentity.tsx`): formulário de coleta inicial
- **WizardStepResearch** (`src/components/wizard/WizardStepResearch.tsx`): loading simulado de pesquisa
- **WizardStepValidation** (`src/components/wizard/WizardStepValidation.tsx`): achados do agente com Confirmar/Corrigir/Ignorar
- **WizardStepNiche** (`src/components/wizard/WizardStepNiche.tsx`): seleção de segmento + posicionamento
- **WizardStepSummary** (`src/components/wizard/WizardStepSummary.tsx`): resumo final + tom de voz + plataformas

### Stepper Labels

1. "Seu Negócio"
2. "Pesquisando..."
3. "Validação"
4. "Nicho & Posicionamento"
5. "Resumo"

### Etapa 1 — Coleta Inicial

- Campos: Nome do negócio (obrigatório), URL do site (opcional), repeater de redes sociais (até 5, com select de plataforma + handle)
- Select de plataforma: Instagram, LinkedIn, TikTok, YouTube, Twitter/X, Facebook, WhatsApp, Google Meu Negócio
- Validação: nome não vazio

### Etapa 2 — Pesquisa (Loading)

- Ícone `MagnifyingGlass` com pulse + spinner
- Texto: "Pesquisando na internet sobre {businessName}..."
- Items sequenciais (1 a cada 1.5s): busca → redes sociais → concorrentes → segmento → concluído
- Auto-avanço após 1s do último item

### Etapa 3 — Validação de Achados

- 6-8 achados mock por categoria (identidade, segmento, concorrente, rede_social, dado_publico)
- Cada achado: label + valor + botões Confirmar/Corrigir/Ignorar
- Confirmar: background verde, ícone check
- Corrigir: input inline, valor original riscado + correção em azul
- Ignorar: background cinza, texto riscado
- Toggle: usuário pode mudar a decisão
- CTA "Tudo certo, continuar" habilitado quando todos revisados
- Contador "X de Y itens revisados"

### Etapa 4 — Nicho & Posicionamento

- Grid de cards de segmento (3 colunas desktop, 2 mobile): Saúde & Bem-estar, Tecnologia, Varejo, Serviços B2B, Educação, Alimentação, Finanças, Indústria
- Seleção única (radio). Segmento da etapa 3 vem pré-selecionado
- Sub-opções de público-alvo como chips multi-select (3-4 por segmento)
- Textarea de posicionamento com sugestão mock do agente
- Botões "Usar sugestão do agente" / "Escrever do meu jeito"

### Etapa 5 — Resumo

- Card com: Identidade, Segmento, Posicionamento, Tom de voz (select 5 opções), Plataformas (checkboxes)
- Links "Editar" em cada seção voltam para a etapa correspondente
- Botão "Criar Perfil" → toast sucesso → navega para `/profiles`

### Modo Edição

- Via `/profiles/new?edit=PRF-XXX`: pré-preenche campos, pula etapas 2 e 3
- Botão final: "Salvar Alterações"

## Features

1. **F-024-A**: ProfileWizardPage com stepper horizontal de 5 etapas — navegação avanço/retorno, indicador de etapa ativa, layout `max-w-2xl` centralizado
2. **F-024-B**: Etapa 1 (Coleta) — formulário com nome, URL, repeater de redes sociais com select de plataforma
3. **F-024-C**: Etapa 2 (Loading) — animação de pesquisa com items sequenciais e auto-avanço
4. **F-024-D**: Etapa 3 (Validação) — achados mock com ações Confirmar/Corrigir/Ignorar, correção inline, contador de revisados
5. **F-024-E**: Etapa 4 (Nicho) — grid de segmentos, chips de público-alvo, textarea de posicionamento com toggle agente/manual
6. **F-024-F**: Etapa 5 (Resumo) — card com resumo completo, select de tom de voz, checkboxes de plataformas, links para editar seções
7. **F-024-G**: Modo edição — detecção de query param `?edit=PRF-XXX`, pré-preenchimento de campos, skip das etapas 2-3
8. **F-024-H**: i18n — strings do wizard em pt/en/es

## Limites

- NÃO implementar pesquisa real na internet — etapa 2 é loading simulado, etapa 3 usa dados mock fixos
- NÃO persistir o perfil criado além do state local (não sobrevive a reload)
- Achados mock são estáticos — não dependem do nome digitado na etapa 1

## Dependências

- **PRP-022** — tipos `Profile` e interfaces relacionadas
- **PRP-023** — rota `/profiles/new` e ProfilesPage para navegação de retorno
