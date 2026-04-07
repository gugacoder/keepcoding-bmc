# KeepBiz -- Visão Geral do Produto

> **Tipo:** Suite (múltiplos apps + workflows)
> **Público:** PMEs Operacionais (SMBs com retaguarda administrativa)
> **Empresa:** Keep Coding
> **Status:** Fase de hipótese / piloto

---

## O que é

KeepBiz é uma **suite de apps e workflows** que automatiza o processo decisório e o processo produtivo de PMEs operacionais. Não é um ERP, não substitui ferramentas existentes -- é uma **camada de aprendizado** que se sobrepõe aos sistemas que o cliente já usa.

A promessa central:

> "Fazer mais trabalho sem contratar mais gente."

---

## Como funciona (o Agent Learning Loop)

```
[1. MAPEAR] → [2. CONSTRUIR] → [3. IMPLANTAR] → [4. OBSERVAR] → [5. APRENDER] → [6. ATIVAR]
```

1. **Mapear** -- Observamos as tarefas internas do dia a dia da empresa (não o produto do cliente, mas a operação: RH, financeiro, agenda, pagamentos, recrutamento, supply chain).
2. **Construir** -- A fábrica de Workflows gera automaticamente **apps-wrapper** (desktop + mobile) que espelham essas tarefas.
3. **Implantar** -- O pessoal passa a usar os nossos apps em vez de mexer no ERP/CRM diretamente. Os apps replicam as ações nos sistemas existentes (via MCP, REST API, etc.).
4. **Observar** -- Agentes assistem silenciosamente cada interação: cliques, inputs, decisões, padrões.
5. **Aprender** -- Agentes internalizam o fluxo por observação contínua.
6. **Ativar** -- Quando pronto, o cliente ativa o "heartbeat" e o agente executa a tarefa de forma autônoma.

> **Insight central:** O app-wrapper é um cavalo de troia. Canaliza o trabalho pelo nosso sistema para que o agente aprenda e, depois, assuma.

---

## Os 3 pilares do produto

| Pilar | O que faz | Como se conecta |
|---|---|---|
| **Agents (Agency)** | Operam qualquer ferramenta que o cliente já usa -- via MCP, REST API, Bash, ou outros conectores. Agnósticos de ferramenta. | Executam as tarefas que aprenderam observando o pessoal. |
| **GRZ (Monitor)** | Monitora sinais de negócio em tempo real -- Google Ads, Meta Business, leads, funil, conversão. | Acompanha a eficácia das operações e alimenta decisões. |
| **Workflows (Fábrica)** | Enxame de agentes que produz qualquer coisa que código constrói: apps, criativos, vídeos, PDFs, campanhas de marketing. | Constrói os apps-wrapper e gera outputs operacionais e de marketing sob demanda. |

---

## Arquitetura conceitual

```
                +--------------------------+
                |       PRODUTOS           |
                |                          |
                |  KeepBiz (SUITE) ------> |  Suite de apps + workflows
                |      |                   |  para PMEs (automação de
                |      v                   |  decisão + produção)
                |  Keep Solo (APP) ------> |  Versão leve para
                |                          |  solopreneurs
                +--------------------------+

                +--------------------------+
                |     INFRAESTRUTURA       |
                +--------------------------+
                |                          |
     +----------+------+  +-------+-------+---------+
     |  Agency          |  |  GRZ          |  Workflows  |
     |  (Agentes que    |  |  (Monitora    |  (Enxame de |
     |   operam tools   |  |   leads,      |   agentes   |
     |   via MCP, REST, |  |   funil,      |   que constr|
     |   Bash, APIs)    |  |   Google/     |   qualquer  |
     |                  |  |   Meta Ads)   |   coisa)    |
     +------------------+  +--------------++-----------+
```

---

## Segmento de cliente

**PMEs Operacionais** (ou "PMEs com Retaguarda")

Empresas pequenas e médias com operação interna real de escritório: RH, financeiro, agenda, pagamentos, recrutamento, supply chain. **Não importa o setor** -- importa a estrutura interna que mantêm.

Características:
- 5 a 200 pessoas
- Possuem back-office estruturado
- Usam ferramentas existentes (ERPs, CRMs, planilhas, WhatsApp)
- Querem crescer sem aumentar headcount

---

## O que KeepBiz NÃO é

- **Não é um ERP.** Não substitui Totvs, SAP, ou qualquer sistema do cliente.
- **Não é consultoria permanente.** O serviço hands-on é temporário; o objetivo é o dashboard self-service.
- **Não é uma ferramenta de automação genérica** (tipo Zapier/Make). Os agentes aprendem por observação, não por configuração manual de regras.
- **Não mexe no produto do cliente.** Automatiza operações internas, não o que o cliente vende ao mercado.
