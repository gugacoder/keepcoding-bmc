# PRP-008 — Conectores

**Passada:** 2 — Zona 3: Agentes & Operações
**Specs:** S-008
**Discoveries:** D-012
**Prioridade:** 7

---

## Objetivo

Implementar a interface de gerenciamento de conectores (integrações) em ambos os apps — grid com filtros no KeepBiz e lista simplificada no KeepSolo. Demonstra que os agentes operam ferramentas reais do cliente.

## Escopo

### KeepBiz — Conectores (`/agents/connectors`)
- **Grid de conectores**: ícone, nome, status badge (Conectado / Desconectado)
- **Filtros por categoria** (pills): Produtividade, Comunicação, Finanças, Todos — funcionais
- **"Adicionar conector"**: abre catálogo em grid com opções disponíveis (não conectadas)
- **Click em conector existente**: painel de configuração mock (campo API key, botão OAuth decorativo)
- **"Desconectar"**: Dialog de confirmação → muda status

### KeepSolo — Ferramentas (`/agents/tools`)
- **Lista vertical** "Minhas Ferramentas": ícone, nome, status
- **"Adicionar ferramenta"**: lista simplificada de opções
- **"Desconectar"**: confirmação → muda status

### Conectores (dados mock)
- Google Workspace, Microsoft 365, WhatsApp Business (conectados)
- Slack, Trello, ERP XYZ (desconectados)

## Features

1. **F-008-A**: Grid de conectores KeepBiz — cards com ícone, nome, status badge, layout responsivo
2. **F-008-B**: Filtros por categoria — pills horizontais, click filtra o grid, "Todos" reseta
3. **F-008-C**: Catálogo "Adicionar conector" — Dialog/Sheet com grid de conectores desconectados, click conecta
4. **F-008-D**: Painel de configuração mock — Sheet com campo API key (readonly), botão OAuth decorativo, botão "Desconectar"
5. **F-008-E**: Dialog de desconexão — confirmação antes de remover conexão
6. **F-008-F**: Lista de ferramentas KeepSolo — lista vertical simplificada com add/remove
7. **F-008-G**: State management — toggle de status conectado/desconectado persiste na sessão

## Limites

- NÃO integrar com APIs reais — tudo é mock
- NÃO implementar configuração real de OAuth ou API keys
- Painel de config é visual — campos são readonly ou decorativos

## Dependências

- **PRP-001** — dados mock (conectores)
- **PRP-002** / **PRP-003** — shells com rotas
