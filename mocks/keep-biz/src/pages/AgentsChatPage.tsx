import { useState, useRef, useEffect, useCallback } from 'react'
import { PaperPlaneRight, Robot, Brain, Clock, ChartBar } from '@phosphor-icons/react'
import { useAgents } from '@/contexts/AgentsContext'
import type { Agent } from '@/data/types'

// ─── Response pools per agent role ─────────────────────────────────────────────

const RESPONSE_POOLS: Record<string, string[]> = {
  'agent-001': [
    'Processando os lançamentos agora. Identifiquei 3 divergências nos últimos registros — precisa que eu gere o relatório detalhado?',
    'O extrato do Bradesco foi baixado às 07h45 via OFX. Tudo em ordem. Posso iniciar a conciliação automaticamente?',
    'Encontrei uma inconsistência de R$ 1.247,50 no centro de custo de Marketing. Devo encaminhar para o CFO ou prefere validar antes?',
    'Relatório de fechamento mensal gerado e enviado para financeiro@empresa.com.br e CFO@empresa.com.br. Assinatura digital aplicada.',
    'Com base no histórico, a margem operacional deste mês está 4,2% acima da média do trimestre. Posso preparar um comparativo?',
    'Detectei 2 lançamentos duplicados no sistema ERP. Isso não é incomum na virada de mês — aguardando sua confirmação para estornar.',
    'A conciliação semanal está agendada para sexta às 08h00. Até lá vou monitorar qualquer anomalia no fluxo de caixa.',
    'Importei os dados da planilha. 98,6% dos lançamentos foram conciliados automaticamente. Restam 7 que precisam de intervenção manual.',
  ],
  'agent-002': [
    'Disparei a sequência de e-mails para 23 leads no estágio "consideração". Taxa de abertura inicial: 61% — bem acima da nossa média de 48%.',
    'Identifiquei 4 leads com alto potencial que não receberam follow-up nos últimos 15 dias. Posso retomar a sequência agora?',
    'O lead "Distribuidora Alfa" abriu o e-mail 3 vezes nas últimas 24h mas não clicou. Sugiro uma abordagem direta por telefone.',
    'Próxima execução da campanha agendada para hoje às 14h00. Já preparei 2 variações de assunto para teste A/B.',
    'Dos 47 leads inativos, 12 voltaram a interagir após a última campanha. Movendo-os de volta para "consideração" automaticamente.',
    'Evitando envios para hoje (sexta após 15h) conforme preferência configurada. Reagendei tudo para segunda-feira às 10h.',
    'Leads com ticket acima de R$ 50k sinalizados para aprovação: tenho 2 aguardando sua validação antes do envio.',
    'Análise da semana: 8 novos leads convertidos, taxa de conversão 14,3%. Conteúdo de "caso de sucesso" teve o melhor desempenho.',
  ],
  'agent-003': [
    'Confirmei as 4 reuniões de amanhã. O Carlos Silva confirmou o reagendamento para 16h30 — sem conflitos agora.',
    'Detectei um conflito no calendário da Diretoria para quinta-feira: duas reuniões simultâneas às 10h. Qual tem prioridade?',
    'Sala A está disponível para a reunião de estratégia. Já enviei convites para todos os 6 participantes com pauta incluída.',
    'O Diretor Geral não pode antes das 09h. Movi a reunião da equipe para 09h15 e já notifiquei todos os envolvidos.',
    'Lembrete enviado para a reunião de onboarding do novo colaborador às 14h. Link do Meet incluído no convite.',
    'Conciliando agendas para o workshop de Q2. Os únicos 3 slots disponíveis para todos são: 15/04 às 10h, 16/04 às 14h, ou 17/04 às 09h.',
    'Atualizei o calendário da semana: 11 reuniões confirmadas, 2 pendentes de resposta, 1 reagendamento necessário.',
    'A sala B foi reservada para o treinamento de sexta. Capacidade: 20 pessoas. Lista de presença preparada e enviada ao RH.',
  ],
  'agent-004': [
    'Rascuncei 2 posts para a campanha Black Friday. Preciso do briefing aprovado para avançar com os demais formatos.',
    'Aqui está uma sugestão para o post de Instagram: "Transforme sua rotina com [produto]. Black Friday: até 40% off. Link na bio." Quer que eu ajuste o tom?',
    'Preparei 3 variações do texto para o short do TikTok — uma mais divertida, uma informativa e uma com CTA agressivo. Qual direção você prefere?',
    'Revisei o post anterior: reduzi para 2.180 caracteres e adicionei 4 hashtags relevantes (#BlackFriday #Promoção #[marca] #OfertaEspecial).',
    'A voz da marca está aplicada: profissional mas acessível, sem jargões técnicos. Posso gerar mais variações se quiser testar diferentes abordagens.',
    'O calendário editorial de abril está quase completo. Faltam apenas os conteúdos dos dias 22 e 28. Posso sugerir temas baseados no que performou melhor?',
    'Análise do conteúdo da semana passada: o post sobre "bastidores" teve 3x mais engajamento que os posts de produto. Devo priorizar esse formato?',
  ],
}

const FALLBACK_POOL = [
  'Entendido. Processando a solicitação e vou retornar com os dados em breve.',
  'Executado com sucesso. Há mais alguma coisa que posso fazer por você?',
  'Analisando o contexto. Identifico 2 pontos de atenção que podem ser relevantes aqui.',
  'Tarefa registrada. Vou executar e notificar quando concluir.',
  'Verificando o histórico de operações. Posso ter mais detalhes sobre o que você precisa?',
  'Configuração atualizada conforme solicitado. Entrarei em ação na próxima janela de execução.',
]

function getResponse(agentId: string): string {
  const pool = RESPONSE_POOLS[agentId] ?? FALLBACK_POOL
  return pool[Math.floor(Math.random() * pool.length)]
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string
  from: 'user' | 'agent'
  text: string
  timestamp: Date
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-100 text-slate-500 px-4 py-3 rounded-2xl rounded-tl-sm text-sm flex items-center gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Agent['status'] }) {
  const map: Record<Agent['status'], { label: string; cls: string }> = {
    Working: { label: 'Working', cls: 'bg-emerald-100 text-emerald-700' },
    Idle: { label: 'Idle', cls: 'bg-slate-100 text-slate-600' },
    'Waiting on data': { label: 'Waiting', cls: 'bg-amber-100 text-amber-700' },
  }
  const { label, cls } = map[status]
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  )
}

function ContextPanel({ agent }: { agent: Agent }) {
  const lastTraining = new Date(agent.lastActive).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const memorySample = agent.memory.slice(0, 4)

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {/* Status */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Robot size={16} weight="duotone" className="text-blue-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Status
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-700">{agent.name}</span>
          <StatusBadge status={agent.status} />
        </div>
        <p className="text-xs text-slate-400">{agent.role}</p>
        <p className="text-xs text-slate-400">{agent.department}</p>
        {agent.heartbeat && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-600 font-medium">Heartbeat ativo</span>
          </div>
        )}
      </div>

      {/* Training */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ChartBar size={16} weight="duotone" className="text-indigo-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Treinamento
          </span>
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">Progresso</span>
          <span className="text-xs font-semibold text-slate-700">
            {agent.trainingProgress}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${agent.trainingProgress}%` }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Clock size={11} className="text-slate-400" />
          <span className="text-xs text-slate-400">Último treino: {lastTraining}</span>
        </div>
      </div>

      {/* Memory */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} weight="duotone" className="text-purple-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Memória
          </span>
        </div>
        {memorySample.length === 0 ? (
          <p className="text-xs text-slate-400">Sem itens de memória</p>
        ) : (
          <ul className="space-y-2">
            {memorySample.map((item) => (
              <li key={item.id} className="text-xs text-slate-600 leading-relaxed">
                <span
                  className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mr-1.5 ${
                    item.category === 'operações'
                      ? 'bg-blue-50 text-blue-600'
                      : item.category === 'regras'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-purple-50 text-purple-600'
                  }`}
                >
                  {item.category}
                </span>
                {item.content}
              </li>
            ))}
          </ul>
        )}
        {agent.memory.length > 4 && (
          <p className="text-xs text-slate-400 mt-2">
            +{agent.memory.length - 4} itens adicionais
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentsChatPage() {
  const { agents } = useAgents()

  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agents[0]?.id ?? ''
  )
  const [conversations, setConversations] = useState<Record<string, Message[]>>({})
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? agents[0]
  const messages = conversations[selectedAgentId] ?? []

  // Auto-scroll to bottom when messages or typing indicator changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSelectAgent = useCallback(
    (agentId: string) => {
      setSelectedAgentId(agentId)
      setInput('')
      setIsTyping(false)
    },
    []
  )

  const sendMessage = useCallback(() => {
    const text = input.trim()
    if (!text || isTyping) return

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      from: 'user',
      text,
      timestamp: new Date(),
    }

    setConversations((prev) => ({
      ...prev,
      [selectedAgentId]: [...(prev[selectedAgentId] ?? []), userMsg],
    }))
    setInput('')
    setIsTyping(true)

    const delay = 1000 + Math.random() * 1000 // 1–2s

    setTimeout(() => {
      const agentMsg: Message = {
        id: `msg-${Date.now()}-agent`,
        from: 'agent',
        text: getResponse(selectedAgentId),
        timestamp: new Date(),
      }
      setConversations((prev) => ({
        ...prev,
        [selectedAgentId]: [...(prev[selectedAgentId] ?? []), agentMsg],
      }))
      setIsTyping(false)
    }, delay)
  }, [input, isTyping, selectedAgentId])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  if (!selectedAgent) {
    return (
      <div className="p-6 text-slate-500 text-sm">Nenhum agente disponível.</div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-slate-900">Chat com Agentes</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Converse, dê feedback e refine o treinamento
        </p>
      </div>

      {/* Mobile: agent dropdown */}
      <div className="lg:hidden px-6 pb-4">
        <select
          value={selectedAgentId}
          onChange={(e) => handleSelectAgent(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
        >
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} — {agent.department}
            </option>
          ))}
        </select>
      </div>

      {/* Main 3-column layout (desktop) / single column (mobile) */}
      <div className="flex flex-1 overflow-hidden px-6 pb-6 gap-4">
        {/* Column 1: Agent list (desktop only) */}
        <div className="hidden lg:flex flex-col w-56 shrink-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-3 py-2.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Agentes
            </p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId
              return (
                <button
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${
                    isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        agent.heartbeat ? 'bg-emerald-400' : 'bg-slate-300'
                      }`}
                    />
                    {agent.heartbeat && (
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-blue-700' : 'text-slate-700'
                      }`}
                    >
                      {agent.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{agent.department}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Column 2: Chat area */}
        <div className="flex flex-col flex-1 min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
            <div className="relative shrink-0">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  selectedAgent.heartbeat ? 'bg-emerald-400' : 'bg-slate-300'
                }`}
              />
              {selectedAgent.heartbeat && (
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {selectedAgent.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {selectedAgent.role} · {selectedAgent.department}
              </p>
            </div>
            <div className="ml-auto shrink-0">
              <StatusBadge status={selectedAgent.status} />
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Robot size={40} weight="duotone" className="text-slate-300 mb-3" />
                <p className="text-sm text-slate-400">
                  Inicie a conversa com {selectedAgent.name}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Tire dúvidas, dê feedback ou refine o treinamento
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-sm lg:max-w-md px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && <TypingIndicator />}
          </div>

          {/* Input area */}
          <div className="px-4 py-3 border-t border-slate-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Mensagem para ${selectedAgent.name}...`}
              disabled={isTyping}
              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <PaperPlaneRight size={16} weight="fill" />
              <span className="text-sm hidden sm:inline">Enviar</span>
            </button>
          </div>
        </div>

        {/* Column 3: Context panel (desktop only) */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 overflow-hidden">
          <ContextPanel agent={selectedAgent} />
        </div>
      </div>
    </div>
  )
}
