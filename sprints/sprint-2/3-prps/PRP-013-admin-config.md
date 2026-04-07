# PRP-013 — Configurações, Admin, RBAC & Audit Log

**Passada:** 4 — Admin & Polish
**Specs:** S-013, S-014
**Discoveries:** D-019, D-020, D-021, D-022
**Prioridade:** 6

---

## Objetivo

Implementar as telas de configuração/admin de ambos os apps — perfil, equipe com RBAC (KeepBiz), notificações, plano com upgrade mock, audit log (KeepBiz) e human-in-loop. Completa a experiência administrativa do produto.

## Escopo

### KeepBiz — Configurações (`/settings`)

**Seções (tabs ou accordion):**

1. **Perfil da empresa**: form com nome, CNPJ, endereço, logo placeholder → edit/save + toast de confirmação
2. **Equipe**: lista de membros (nome, email, role badge) + "Convidar" → Dialog (email + role select: Admin/Operador/Viewer)
3. **Notificações**: toggles agrupados por categoria (Agentes, Conteúdo, Monitor, Sistema) — persistem no state
4. **Plano**: card do plano atual (nome, preço, features) + "Fazer upgrade" → comparação de 3 planos mock
5. **Audit Log**: tabela de ações recentes (quem, ação, dado tocado, timestamp, resultado) — 10-15 entradas mock
6. **Idioma**: seletor pt/en/es (usa i18n do PRP-001)

**RBAC Presets:**
- **Admin**: acesso total
- **Operador**: operar agentes + aprovar conteúdo
- **Viewer**: somente visualização

**Human-in-loop:**
- Auto-prompt ao criar agente: "Standalone bot or wrap in app?"
- Dialog de confirmação quando agente executa ação high-stakes (dinheiro/contratos) — mock com 2-3 exemplos no audit log

### KeepSolo — Config (`/config`)

**Seções:**

1. **Perfil pessoal**: form com nome, email, foto placeholder → edit/save + toast
2. **Notificações**: 5 toggles (leads novos, follow-up pendente, conteúdo publicado, agente precisa atenção, resumo semanal)
3. **Plano**: card atual + upgrade — 3 planos (Solo R$97, Pro R$197, Business R$397) com comparação de features
4. **Idioma**: seletor pt/en/es

## Features

1. **F-013-A**: Perfil da empresa KeepBiz — form editável com save + toast
2. **F-013-B**: Gestão de equipe KeepBiz — lista de membros + Dialog de convite com email + role
3. **F-013-C**: RBAC presets — badge de role visível por membro, permissões no detail
4. **F-013-D**: Notificações KeepBiz — toggles por categoria, persistem no state da sessão
5. **F-013-E**: Plano KeepBiz — card atual + Dialog de comparação de planos
6. **F-013-F**: Audit log — tabela com entradas mock (inclui exemplos de human-in-loop)
7. **F-013-G**: Perfil pessoal KeepSolo — form editável com save + toast
8. **F-013-H**: Notificações KeepSolo — 5 toggles simplificados
9. **F-013-I**: Plano KeepSolo — card + comparação de 3 planos com preços
10. **F-013-J**: Seletor de idioma (ambos) — dropdown que troca locale via i18n

## Limites

- NÃO implementar autenticação real — tudo mock
- NÃO enviar emails de convite — Dialog apenas adiciona membro na lista
- NÃO processar pagamento — upgrade é visual
- Audit log não se atualiza em real-time — lista estática

## Dependências

- **PRP-001** — i18n, dados mock (equipe, audit log)
- **PRP-002** / **PRP-003** — shells com rotas `/settings` e `/config`
- **PRP-006** — lista de agentes (para human-in-loop e auto-prompt)
