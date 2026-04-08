import { useRef, useEffect, useState, useCallback } from 'react'
import { Robot, PaperPlaneTilt } from '@phosphor-icons/react'
import { agents } from '@/data'

const agent = agents[0]!

// Pool de respostas contextuais por keyword
type ResponseRule = {
  keywords: string[]
  responses: string[]
}

const RESPONSE_RULES: ResponseRule[] = [
  {
    keywords: ['agenda', 'agendamento', 'consulta', 'marcar', 'horário', 'disponível'],
    responses: [
      'Já verifiquei a agenda: você tem 3 slots disponíveis amanhã às 10h, 14h e 16h. Qual deles prefere que eu ofereça para a próxima cliente?',
      'Os próximos 2 dias estão com 5 agendamentos confirmados. Terça ainda tem espaço das 15h às 17h — quer que eu mantenha reservado?',
      'A confirmação de consulta das 14h de amanhã foi enviada por WhatsApp e e-mail. A cliente já confirmou a presença.',
    ],
  },
  {
    keywords: ['lead', 'leads', 'cliente', 'clientes', 'contato', 'novo', 'novos'],
    responses: [
      'Esta semana entraram 3 novos leads: Renata (Instagram), Paulo (indicação da Camila) e Sofia (Google). Renata respondeu ontem — quer que eu acompanhe?',
      'Você tem 2 leads parados no estágio "contato" há mais de 5 dias. Posso enviar uma mensagem de follow-up personalizada para cada um?',
      'Sofia chegou pelo Google após ver seu post sobre emagrecimento. Ela perguntou sobre consulta online — mandei os detalhes e aguardo resposta.',
    ],
  },
  {
    keywords: ['post', 'conteúdo', 'instagram', 'redes', 'publicar', 'publicação', 'stories'],
    responses: [
      'O rascunho do post "3 dicas para emagrecer sem sofrimento" está pronto. Já defini o horário para sexta às 18h — posso publicar automaticamente?',
      'Seu post de terça teve 234 curtidas e 18 comentários — acima da média das últimas 4 semanas. Quer que eu repita o formato essa sexta?',
      'Tenho 2 ideias de conteúdo baseadas nos comentários da semana passada: "Como manter o resultado após a dieta" e "O erro que todo mundo comete ao começar". Qual prefere?',
    ],
  },
  {
    keywords: ['cancelamento', 'cancelar', 'remarcar', 'faltou', 'desmarcou'],
    responses: [
      'A Fernanda cancelou a consulta de quarta às 11h com menos de 24h de antecedência. Aplico a cobrança de 50% conforme nossa regra? (R$ 90)',
      'Recebi solicitação de remarcação da Joana — ela quer mover de quinta para a próxima segunda. Já verifiquei: segunda às 15h está livre. Confirmo para ela?',
      'Tivemos 1 cancelamento hoje. O slot das 16h ficou disponível. Quer que eu entre na lista de espera e ofereça para alguém?',
    ],
  },
  {
    keywords: ['treinamento', 'treinar', 'aprender', 'melhorar', 'ajustar', 'refinar'],
    responses: [
      'Estou em 78% do treinamento. Preciso de mais alguns exemplos de como você responde cancelamentos — pode me mandar 2 ou 3 mensagens que você usaria?',
      'Aprendi com as últimas 12 interações que você prefere confirmar agendamentos 24h antes. Já atualizei minha rotina para seguir esse padrão automaticamente.',
      'Para melhorar meu treinamento, ajudaria se você avaliasse minhas últimas 5 respostas aos clientes. Quer ver um resumo?',
    ],
  },
  {
    keywords: ['relatório', 'resumo', 'semana', 'mês', 'resultado', 'métricas', 'números'],
    responses: [
      'Aqui está o resumo da semana: 12 consultas realizadas, 3 novos leads, 2 cancelamentos, R$ 1.980 em receita confirmada. Quer o relatório completo por e-mail?',
      'Este mês você atendeu 47 clientes — 8 a mais que o mês anterior. A taxa de retorno está em 68%. Quer que eu destaque os pacientes que não voltaram em 60+ dias?',
      'Performance de conteúdo: 3 posts essa semana geraram 541 interações no total. O melhor foi o de segunda com 234 curtidas.',
    ],
  },
  {
    keywords: ['preço', 'valor', 'cobrança', 'pagamento', 'pagar', 'financeiro'],
    responses: [
      'Os valores atuais: R$ 180 presencial e R$ 150 online. Não menciono preços antes de explicar a proposta de valor — é sua regra, e eu sigo à risca.',
      'Tem 2 pagamentos pendentes desta semana: Marcos (R$ 150) e Luiza (R$ 180). Posso enviar um lembrete gentil para os dois?',
      'Recebi pergunta sobre preço no Instagram. Já respondi com a proposta de valor primeiro, conforme sua orientação, e depois apresentei os valores.',
    ],
  },
  {
    keywords: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'tudo', 'como'],
    responses: [
      'Oi! Tudo em ordem por aqui. Hoje já confirmei 4 consultas, respondi 2 DMs e programei o post de sexta. Como posso te ajudar agora?',
      'Olá! Tenho um resumo rápido para você: 3 consultas confirmadas amanhã, 1 novo lead chegou pelo Google e seu post de terça está performando bem. O que precisa?',
      'Bom dia! Comecei cedo hoje: enviei as confirmações de amanhã e organizei a agenda da semana. Tem alguma prioridade que quer me passar?',
    ],
  },
]

const FALLBACK_RESPONSES = [
  'Entendido! Estou processando isso e vou te dar um retorno em breve. Tem mais alguma coisa que posso fazer enquanto isso?',
  'Anotei. Vou incluir isso nas minhas prioridades de hoje. Precisa de mais alguma coisa agora?',
  'Certo! Vou cuidar disso. Qualquer atualização, te aviso imediatamente.',
  'Perfeito. Deixa comigo — assim que tiver novidade, te mando uma mensagem.',
  'Registrado. Posso te ajudar com mais alguma coisa no momento?',
]

function pickResponse(input: string): string {
  const lower = input.toLowerCase()

  for (const rule of RESPONSE_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      const pool = rule.responses
      return pool[Math.floor(Math.random() * pool.length)]!
    }
  }

  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]!
}

type Message = {
  id: number
  from: 'user' | 'agent'
  text: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    from: 'agent',
    text: 'Oi! Acabei de confirmar a consulta da Camila para amanhã às 14h. Como posso te ajudar?',
  },
]

export function AgentsChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(INITIAL_MESSAGES.length + 1)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = useCallback(() => {
    const text = input.trim()
    if (!text || isTyping) return

    const userMsg: Message = { id: nextId.current++, from: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const delay = 1000 + Math.random() * 1000 // 1–2s
    const response = pickResponse(text)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, from: 'agent', text: response },
      ])
    }, delay)
  }, [input, isTyping])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="flex flex-col h-full bg-secondary/30">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <Robot size={20} weight="duotone" className="text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-card" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{agent.name}</p>
          <p className="text-xs text-green-500 font-medium">Online · {agent.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.from === 'agent' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 shadow-sm">
                <Robot size={14} weight="duotone" className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.from === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-sm'
                  : 'bg-card border border-border text-foreground rounded-2xl rounded-bl-md shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Robot size={14} weight="duotone" className="text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 bg-card/80 backdrop-blur-sm border-t border-border">
        <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-2.5 border border-border focus-within:border-primary transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Manda uma mensagem..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 bg-primary hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <PaperPlaneTilt size={16} weight="duotone" className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
