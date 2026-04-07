# KeepBiz -- Os 3 Pilares

---

## 1. Agency (Agentes)

### O que é
Produto já existente da Keep Coding que "envia" agentes de IA. Esses agentes operam qualquer ferramenta que o cliente já usa.

### Como funciona
- Os agentes são **agnósticos de ferramenta** -- não importa se o cliente usa SAP, Totvs, Google Sheets, WhatsApp ou qualquer outro sistema.
- Conectam-se via **MCP**, **REST API**, **Bash**, ou qualquer outro protocolo que permita interação programática.
- No KeepBiz, os agentes têm dois papéis:
  1. **Observadores** -- Assistem o pessoal usando os apps-wrapper e aprendem padrões.
  2. **Operadores** -- Depois de aprender, executam as tarefas autonomamente nos sistemas do cliente.

### O momento "heartbeat"
Quando um agente está pronto para operar sozinho, o cliente "ativa o heartbeat" -- liga o agente para execução autônoma. A partir daí, o agente faz o trabalho sem intervenção humana.

---

## 2. GRZ (Monitor)

### O que é
Produto existente da Keep Coding que monitora sinais de negócio em tempo real.

### O que monitora
- **Google Ads** -- performance de campanhas, custo por lead, conversões
- **Meta Business** -- Facebook/Instagram ads, alcance, engajamento
- **Leads** -- entrada, qualificação, estágio no funil
- **Funil de vendas** -- conversão de lead a cliente, gargalos, velocidade
- **Sinais gerais** -- qualquer métrica de negócio relevante

### Papel no KeepBiz
O GRZ é a parte de **vendas e monitoramento** do produto. Ele dá ao cliente (e aos agentes) visibilidade sobre o desempenho comercial da empresa em tempo real, sem necessidade de dashboards manuais.

---

## 3. Workflows (Fábrica)

### O que é
Software da Keep Coding que funciona como uma **fábrica automatizada de outputs**. Um enxame de agentes que se comunicam entre si para produzir qualquer coisa que código possa construir.

### O que produz
- **Apps** -- os apps-wrapper para desktop e mobile (caso principal do KeepBiz)
- **Criativos** -- imagens, banners, materiais visuais para redes sociais
- **Vídeos** -- conteúdo audiovisual para marketing
- **PDFs** -- relatórios, propostas, documentos operacionais
- **Campanhas de marketing** -- copy, anúncios, sequências de email
- **Código** -- qualquer output que programação permite

### Como funciona
- Agentes dentro do enxame se dividem em papéis: pesquisa, construção, codificação, revisão.
- Comunicam-se entre si para entregar o output final.
- No contexto do KeepBiz, a principal entrega é a **construção automática de apps-wrapper** que espelham as tarefas do pessoal.

### Papel no KeepBiz
Os Workflows são a parte de **produção e marketing** do produto. Geram tanto os apps operacionais (para o Agent Learning Loop) quanto materiais de marketing (para alimentar o funil monitorado pelo GRZ).

---

## Como os 3 pilares se conectam

```
         Agents (Agency)
              ↕
    Operam ferramentas do cliente
    Observam uso dos apps-wrapper
    Assumem tarefas autônomas
              ↕
    ┌─────────┴──────────┐
    │                    │
GRZ (Monitor)      Workflows (Fábrica)
    │                    │
Monitora funil,    Constrói apps-wrapper,
leads, ads,        gera marketing,
conversão          produz outputs
    │                    │
    └─────────┬──────────┘
              ↕
      Resultado para o cliente:
      "Mais trabalho, menos gente"
```

O loop é contínuo:
- **Workflows** constroem os apps → **Agents** observam o uso → **Agents** assumem → **GRZ** monitora resultados → **Workflows** geram marketing para crescer → ciclo repete.
