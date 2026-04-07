# Documento de Hipóteses -- Keep Coding

> **Data:** 6 de abril de 2026
> **Origem:** Business Model Canvas v1
> **Objetivo:** Transformar cada premissa do canvas em hipótese testável com critério claro. Checklist de execução para o time.

---

## Como usar

Cada hipótese tem:

- **Hipótese** -- o que acreditamos.
- **Se falhar** -- o que quebra.
- **Critério** -- como sabemos se é verdade ou não.
- **Prazo** -- quando precisamos da resposta.
- **Status** -- pendente / em teste / validada / invalidada.

Revisem juntos a cada semana. Atualizem o status conforme os pilotos avançam.

---

## H1. O pessoal vai usar os apps-wrapper

**Hipótese:** Funcionários de PMEs vão adotar os apps que construímos em vez de mexer diretamente no ERP/CRM que já conhecem.

**Se falhar:** Os agentes não têm dados para aprender. O loop inteiro para.

**Critério:** Nos dois pilotos, pelo menos 80% das tarefas mapeadas passam a ser executadas pelo app-wrapper dentro de 30 dias após o deploy.

**Prazo:** 30 dias após deploy em cada piloto.

**Status:** Pendente.

---

## H2. Agentes aprendem por observação

**Hipótese:** Agentes de IA conseguem aprender a executar tarefas operacionais observando como o pessoal usa os apps-wrapper -- sem programação manual de cada regra.

**Se falhar:** O modelo não escala. Vira consultoria para sempre: cada tarefa exige engenharia customizada.

**Critério:** Pelo menos 1 tarefa completa (ex: agendar pagamento, registrar ponto, gerar relatório) é executada de ponta a ponta pelo agente, sem intervenção humana, após período de observação.

**Prazo:** 60 dias após deploy no primeiro piloto.

**Status:** Pendente.

---

## H3. O cliente confia e ativa o agente

**Hipótese:** Donos de PME vão confiar o suficiente para "ativar o heartbeat" e deixar o agente executar tarefas autônomas em sistemas reais.

**Se falhar:** Ficamos presos na fase de observação. A proposta de valor ("fazer mais sem contratar") nunca se concretiza.

**Critério:** Pelo menos 1 dos 2 pilotos ativa pelo menos 1 agente para operação autônoma em tarefa real (não sandbox).

**Prazo:** 90 dias após deploy.

**Status:** Pendente.

---

## H4. PME Operacional é um segmento real

**Hipótese:** "PME com retaguarda operacional" é um segmento coeso -- empresas com estrutura interna de RH, financeiro, agenda, pagamentos, recrutamento, supply chain, independente do setor.

**Se falhar:** Os fluxos internos variam demais entre setores. Não dá para construir produto horizontal; cada cliente exige mapeamento único.

**Critério:** Os dois pilotos (software/TI e home care) compartilham pelo menos 3 fluxos operacionais em comum que podem ser automatizados com os mesmos blocos da fábrica de Workflows.

**Prazo:** Após mapeamento completo dos dois pilotos (comparação cruzada).

**Status:** Pendente.

---

## H5. Pilotos financiam o dashboard

**Hipótese:** A receita dos dois clientes piloto (assinatura + setup) é suficiente para financiar o desenvolvimento do dashboard self-service.

**Se falhar:** Precisamos de capital externo ou o projeto para. O plano depende de ser auto-financiável.

**Critério:** Receita combinada dos pilotos cobre pelo menos 70% do custo de desenvolvimento do dashboard nos primeiros 6 meses.

**Prazo:** 6 meses após início dos pilotos.

**Status:** Pendente.

---

## H6. O dashboard self-service substitui nosso trabalho manual

**Hipótese:** É possível construir um dashboard onde o próprio cliente mapeia seus fluxos, elimina a necessidade de a Keep Coding fazer mapeamento hands-on, e escala sem consultoria.

**Se falhar:** A Keep Coding não sai do modo agência. Fica presa fazendo serviço para cada cliente individual.

**Critério:** Um cliente que nunca interagiu com o time da Keep Coding consegue mapear pelo menos 3 fluxos operacionais sozinho usando o dashboard, sem suporte síncrono.

**Prazo:** A definir após MVP do dashboard.

**Status:** Pendente.

---

## H7. Integrações via API são viáveis sem engenharia pesada

**Hipótese:** Os apps-wrapper conseguem se integrar com os ERPs e CRMs dos clientes (via MCP, REST, etc.) sem desenvolvimento customizado pesado para cada caso.

**Se falhar:** O custo de onboarding por cliente inviabiliza o modelo econômico.

**Critério:** O conjunto mínimo de conectores necessário para cada piloto é implementado em no máximo 2 semanas.

**Prazo:** Primeiras 2 semanas de cada piloto.

**Status:** Pendente.

---

## Resumo

| # | Hipótese | Se falhar | Prazo | Status |
|---|---|---|---|---|
| H1 | Pessoal adota apps-wrapper | Agentes não aprendem | 30d pós-deploy | Pendente |
| H2 | Agentes aprendem por observação | Vira consultoria | 60d pós-deploy | Pendente |
| H3 | Cliente ativa o heartbeat | Proposta não se realiza | 90d pós-deploy | Pendente |
| H4 | PME Operacional é segmento real | Produto não é horizontal | Pós-mapeamento | Pendente |
| H5 | Pilotos financiam dashboard | Precisa capital externo | 6 meses | Pendente |
| H6 | Dashboard substitui consultoria | Não sai de agência | Pós-MVP | Pendente |
| H7 | Integrações viáveis | Onboarding caro demais | 2 sem/piloto | Pendente |

---

*Hipótese invalidada não é fracasso -- é aprendizado que redireciona o negócio antes de gastar mais.*
