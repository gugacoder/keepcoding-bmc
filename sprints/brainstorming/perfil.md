# Conceito: Perfil

## O que é

Um perfil é a representação do negócio/produto/serviço do usuário no mundo digital. Ele contém toda a informação necessária para que o sistema (agente interno builtin) produza conteúdo e gerencie a presença online do cliente.

Por baixo dos panos, um perfil é uma **coleção de arquivos markdown com frontmatter/YAML** usados como prompting na criação de conteúdo.

## Projetos afetos

- `mocks/keep-biz/`
- `mocks/keep-solo/`

## Diferença entre KeepSolo e KeepBiz

### KeepSolo
- O usuário tem **um único perfil**, transparente para ele — ele não vê o conceito de "perfil", apenas interage com o processo de construção.
- A primeira coleta de informações ocorre no **onboarding**.
- O perfil fica disponível para ser modificado quando o usuário quiser.

### KeepBiz
- O usuário pode **criar múltiplos perfis** (ex: dois produtos diferentes com comunicação completamente diferente nas redes).
- As áreas de **criação** e **monitoramento** ficam **indisponíveis** até ele criar seu primeiro perfil.
- Nessas áreas, ele pode visualizar todos os perfis ao mesmo tempo ou um perfil por vez.

## Processo de Construção do Perfil

A construção é conduzida por um **agente conversacional** em etapas:

### 1. Coleta inicial
O agente coleta informações do usuário com o objetivo de realizar um **survey extensivo na internet** e reunir o máximo de informação possível sobre o negócio/produto/serviço.

### 2. Validação
O usuário interage com o agente para:
- Validar o que é real e o que não é
- Corrigir homônimos ou confusões de informação
- Essa interação é valiosa: o agente depois pode usar essas distinções para prover melhor posicionamento do negócio e evitar confusões com marcas similares

### 3. Estudo de nicho
O agente conduz o usuário no processo de claramente situá-lo no mundo:
- Nicho de mercado
- Posicionamento
- Outras informações necessárias para estratégia de comunicação
- O agente faz surveys adicionais para insights até o usuário se sentir confortável com a informação

### 4. Autonomia do usuário
O usuário pode:
- Aceitar as ideias/sugestões do agente
- Ordenar diretamente ao agente ("faça do meu jeito")

### 5. Resultado
O agente reúne informação suficiente sobre o usuário e como ele age no mundo. Esse material será usado pelo agente para **sugestão de campanhas e conteúdos**.
