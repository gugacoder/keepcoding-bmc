import { useEffect, useRef, useState } from 'react'
import { User, ArrowRight } from '@phosphor-icons/react'

const LEAD_NAMES = [
  'Ana Souza',
  'Pedro Lima',
  'Carla Mendes',
  'Rafael Costa',
  'Julia Rocha',
  'Marcos Oliveira',
]

const SOURCES = ['Instagram', 'WhatsApp', 'Indicação', 'Google', 'LinkedIn']

const STAGES = ['Novo Lead', 'Em Contato', 'Proposta', 'Fechado']

type Lead = {
  id: number
  name: string
  source: string
  stage: number
  entering: boolean
}

let leadIdCounter = 0

export function MonitorDemo() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: ++leadIdCounter, name: 'Maria Ferreira', source: 'Instagram', stage: 2, entering: false },
    { id: ++leadIdCounter, name: 'João Batista', source: 'Indicação', stage: 1, entering: false },
  ])
  const [totalLeads, setTotalLeads] = useState(47)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const name = LEAD_NAMES[Math.floor(Math.random() * LEAD_NAMES.length)]
      const source = SOURCES[Math.floor(Math.random() * SOURCES.length)]
      const newLead: Lead = {
        id: ++leadIdCounter,
        name,
        source,
        stage: 0,
        entering: true,
      }

      setLeads((prev) => [newLead, ...prev.slice(0, 3)])
      setTotalLeads((n) => n + 1)

      // Remove entering flag after animation
      setTimeout(() => {
        setLeads((prev) =>
          prev.map((l) => (l.id === newLead.id ? { ...l, entering: false } : l)),
        )
      }, 600)
    }, 3000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="rounded-2xl border border-amber-200 bg-stone-900 text-white overflow-hidden shadow-2xl w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center">
            <User size={12} weight="fill" className="text-white" />
          </div>
          <span className="text-xs font-semibold tracking-wide">KeepSolo · Funil</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 rounded-full border border-amber-500/30">
          <div className="monitor-dot w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span className="text-[11px] font-semibold text-amber-300">{totalLeads} leads</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
      </div>

      {/* Stage pills */}
      <div className="flex gap-1 px-3 pt-3 pb-1.5">
        {STAGES.map((stage, i) => (
          <div
            key={stage}
            className="flex-1 text-center text-[9px] font-semibold uppercase tracking-wider py-1 rounded-md"
            style={{
              backgroundColor:
                i === 0
                  ? 'rgba(245, 158, 11, 0.15)'
                  : i === STAGES.length - 1
                    ? 'rgba(34, 197, 94, 0.12)'
                    : 'rgba(255,255,255,0.05)',
              color: i === 0 ? '#fbbf24' : i === STAGES.length - 1 ? '#86efac' : 'rgba(255,255,255,0.4)',
            }}
          >
            {stage}
          </div>
        ))}
      </div>

      {/* Lead cards */}
      <div className="p-3 flex flex-col gap-2 min-h-[130px]">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className={`lead-card flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
              lead.entering
                ? 'lead-entering border-amber-500/40 bg-amber-500/10'
                : 'border-white/8 bg-white/5'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-amber-300">{lead.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white/90 truncate">{lead.name}</div>
              <div className="text-[10px] text-white/45">via {lead.source}</div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    lead.stage === 0
                      ? 'rgba(245, 158, 11, 0.2)'
                      : lead.stage === STAGES.length - 1
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(255,255,255,0.08)',
                  color:
                    lead.stage === 0
                      ? '#fbbf24'
                      : lead.stage === STAGES.length - 1
                        ? '#86efac'
                        : 'rgba(255,255,255,0.5)',
                }}
              >
                {STAGES[lead.stage]}
              </span>
              {lead.entering && (
                <ArrowRight size={12} className="text-amber-400 shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-stone-800/50">
        <span className="text-[10px] text-white/40">Agente ativo: CRM Bot</span>
        <span className="text-[10px] text-white/40">Sync em tempo real</span>
      </div>
    </div>
  )
}
