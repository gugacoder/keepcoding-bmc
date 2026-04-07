# S-014 — KeepSolo: Configurações

**Discoveries:** D-021
**Passada:** 4 (Admin & Polish)
**Prioridade:** 5
**Depende de:** S-001, S-003

---

## Objetivo

Implementar as configurações do KeepSolo: perfil pessoal, notificações simplificadas, plano com upgrade mock, e seletor de idioma. Versão enxuta do admin, sem equipe nem audit log.

---

## Rota

```
/config              → Página única com seções empilhadas ou tabs
```

---

## Perfil Pessoal

Form:
- Nome (text)
- Email (email)
- Telefone (text, masked)
- Área de atuação (text — ex: "Personal Trainer", "Designer Freelancer")

Botão "Salvar" → toast "Perfil atualizado" — state local.

---

## Notificações

Toggles simplificados:

- Novos leads
- Follow-up pendente
- Conteúdo publicado
- Agente precisa de atenção
- Resumo semanal

Todos ativados por default. Persistem no state da sessão.

---

## Plano

Card:
```
┌─────────────────────────────┐
│ Plano Atual: Solo           │
│ R$ 97/mês                   │
│ 1 agente • Ferramentas: 5   │
│ Monitor de funil             │
│                             │
│ [Fazer Upgrade]             │
└─────────────────────────────┘
```

"Fazer Upgrade" mostra comparação:

| | Solo | Pro | Business |
|---|---|---|---|
| Preço | R$ 97/mês | R$ 197/mês | R$ 397/mês |
| Agentes | 1 | 3 | 5 |
| Ferramentas | 5 | 10 | Ilimitado |
| Suporte | Comunidade | Email | Prioritário |

Botão "Selecionar" → toast "Entre em contato".

---

## Seletor de Idioma

- Dropdown ou radio group: Português, English, Español
- Troca o idioma do app via i18next
- Presente nesta página + no header

---

## Critérios de Aceite

1. [ ] Perfil pessoal: form renderiza, edit/save com toast
2. [ ] Notificações: toggles renderizam e persistem na sessão
3. [ ] Plano: card atual renderiza
4. [ ] Plano: "Fazer Upgrade" mostra comparação
5. [ ] Seletor de idioma funciona (troca strings da UI)
6. [ ] Layout coerente com identidade KeepSolo (cores quentes, rounded)
7. [ ] Página acessível via gear icon no header (mobile) e tab Config (desktop)
