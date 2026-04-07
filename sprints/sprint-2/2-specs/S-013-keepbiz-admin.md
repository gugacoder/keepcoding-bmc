# S-013 — KeepBiz: Configurações + RBAC + Audit Log

**Discoveries:** D-019, D-020, D-022
**Passada:** 4 (Admin & Polish)
**Prioridade:** 6
**Depende de:** S-001, S-002

---

## Objetivo

Implementar a seção de configurações do KeepBiz: perfil da empresa, gestão de equipe com convites e roles, notificações, plano/upgrade, audit log, e RBAC lite com presets Admin/Operador/Viewer.

---

## Rotas

```
/settings              → Tabs ou sidebar de sub-seções
/settings/profile      → Perfil da empresa
/settings/team         → Equipe
/settings/notifications→ Notificações
/settings/plan         → Plano
/settings/audit        → Audit log
```

---

## Perfil da Empresa (`/settings/profile`)

Form com campos:
- Nome da empresa (text)
- CNPJ (text, masked)
- Email de contato (email)
- Telefone (text, masked)
- Endereço (text)
- Logo (upload decorativo — click não faz nada)

Botão "Salvar":
- Click → toast de confirmação: "Perfil atualizado com sucesso"
- State local persiste durante a sessão

---

## Equipe (`/settings/team`)

### Lista de Membros

Dados de `data/team.ts`:

| Coluna | Tipo |
|---|---|
| Avatar | iniciais em círculo |
| Nome | string |
| Email | string |
| Role | badge (Admin=blue, Operador=amber, Viewer=gray) |
| Data de entrada | data formatada |

### Botão "Convidar"

Dialog:
- **Email**: email input (obrigatório)
- **Role**: select (Admin, Operador, Viewer) com descrição breve de cada:
  - Admin: acesso total, pode gerenciar equipe e agentes
  - Operador: pode operar agentes e aprovar conteúdo
  - Viewer: somente visualização
- Botão "Enviar Convite"
- Ao submeter: toast "Convite enviado para {email}" + novo membro aparece na lista com role selecionado

### RBAC — Permissões Visíveis

Click no membro da equipe abre Sheet com:
- Nome, email, role
- Lista de permissões do preset:
  - **Admin**: Gerenciar equipe, Configurar agentes, Aprovar conteúdo, Ver audit log, Configurações
  - **Operador**: Operar agentes, Aprovar conteúdo, Ver audit log
  - **Viewer**: Visualizar dashboards, Visualizar agentes
- Não editável (presets fixos no mock)

### Human-in-the-Loop

Quando um agente executa ação high-stakes (dinheiro, contratos), um Dialog de confirmação aparece:
- "O agente {nome} quer executar: {ação}. Valor: R$ {valor}. Confirmar?"
- Botões: Aprovar / Rejeitar
- Mock: isso aparece como notificação na Orchestrator Bar (indicator amber) e como entrada no audit log
- Implementação: 1-2 entries no audit log com type "human-in-loop" para demonstrar

---

## Notificações (`/settings/notifications`)

Toggles agrupados por categoria:

**Agentes:**
- Agente pausou automaticamente
- Agente precisa de confirmação (high-stakes)
- Treinamento completo

**Conteúdo:**
- Novo conteúdo para revisão
- Conteúdo publicado

**Monitor:**
- Menção negativa detectada
- Pico de atividade

Toggles persistem no state da sessão (useState). Todos ativados por default.

---

## Plano (`/settings/plan`)

Card do plano atual:
```
┌─────────────────────────────┐
│ Plano Atual: Business       │
│ R$ 497/mês                  │
│ 10 agentes • 5 membros      │
│ Social Monitor ilimitado     │
│                             │
│ [Fazer Upgrade]             │
└─────────────────────────────┘
```

Botão "Fazer Upgrade" abre Dialog/page com comparação:

| | Starter | Business | Enterprise |
|---|---|---|---|
| Preço | R$ 197/mês | R$ 497/mês | R$ 997/mês |
| Agentes | 3 | 10 | Ilimitado |
| Membros | 2 | 5 | Ilimitado |
| Monitor | Básico | Completo | Completo + API |
| Suporte | Email | Prioritário | Dedicado |

Botão "Selecionar" em cada plano — decorativo (toast "Entre em contato para upgrade").

---

## Audit Log (`/settings/audit`)

Tabela:

| Coluna | Tipo |
|---|---|
| Timestamp | datetime formatado |
| Ator | nome (agente ou membro) |
| Ação | string descritiva |
| Recurso | string (dado/entidade afetada) |
| Resultado | badge (success/warning/blocked) |

Dados mock: 10-15 entries incluindo:
- Ações de agentes (processou fatura, enviou email, etc.)
- Human-in-loop (confirmação solicitada, aprovada/rejeitada)
- Ações administrativas (membro convidado, agente pausado)

Acessível via `/settings/audit` E via link em Agent Core.

---

## Critérios de Aceite

1. [ ] Perfil da empresa: form renderiza, edit/save com toast funciona
2. [ ] Equipe: lista de membros com roles renderiza
3. [ ] Equipe: "Convidar" abre dialog com email + role select
4. [ ] Equipe: ao convidar, novo membro aparece na lista
5. [ ] RBAC: click no membro mostra permissões do preset
6. [ ] Notificações: toggles por categoria renderizam e persistem na sessão
7. [ ] Plano: card atual renderiza com informações
8. [ ] Plano: "Fazer Upgrade" mostra comparação de planos
9. [ ] Audit log: tabela com 10-15 entries mock renderiza
10. [ ] Audit log: inclui entries de human-in-loop
11. [ ] Seletor de idioma acessível nas configurações
12. [ ] Navegação entre sub-seções funciona (tabs ou sidebar)
