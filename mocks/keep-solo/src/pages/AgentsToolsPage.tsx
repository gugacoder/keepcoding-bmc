import { useState } from 'react'
import {
  Wrench,
  Plus,
  GoogleLogo,
  WhatsappLogo,
  InstagramLogo,
  CreditCard,
  NoteBlank,
  LinkedinLogo,
  Plugs,
  PlugsConnected,
  X,
  Warning,
  CheckCircle,
  EnvelopeSimple,
  TelegramLogo,
  CalendarBlank,
  ChartLine,
  ShoppingCart,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { Connector } from '@/data/types'
import { connectors as initialConnectors } from '@/data'
import { IconBubble } from '@/components/ui/badge'

const ICON_MAP: Record<string, Icon> = {
  GoogleLogo,
  WhatsappLogo,
  InstagramLogo,
  CreditCard,
  NoteBlank,
  LinkedinLogo,
  EnvelopeSimple,
  TelegramLogo,
  CalendarBlank,
  ChartLine,
  ShoppingCart,
}

function ToolIcon({ name, size = 20 }: { name: string; size?: number }) {
  const IconComp = ICON_MAP[name] ?? Plugs
  return <IconComp size={size} weight="duotone" />
}

const CATALOG: Omit<Connector, 'connectedAt'>[] = [
  {
    id: 'cat-001',
    name: 'Calendly',
    icon: 'CalendarBlank',
    status: 'disconnected',
    category: 'Produtividade',
    description: 'Agendamento automático de reuniões sem precisar trocar e-mails.',
  },
  {
    id: 'cat-002',
    name: 'Mailchimp',
    icon: 'EnvelopeSimple',
    status: 'disconnected',
    category: 'Marketing',
    description: 'Envio de campanhas de e-mail marketing para sua lista de contatos.',
  },
  {
    id: 'cat-003',
    name: 'Telegram',
    icon: 'TelegramLogo',
    status: 'disconnected',
    category: 'Comunicação',
    description: 'Canal de comunicação rápida com clientes via Telegram Bot.',
  },
  {
    id: 'cat-004',
    name: 'Google Analytics',
    icon: 'ChartLine',
    status: 'disconnected',
    category: 'Marketing',
    description: 'Acompanhe o tráfego e comportamento dos visitantes do seu site.',
  },
  {
    id: 'cat-005',
    name: 'WooCommerce',
    icon: 'ShoppingCart',
    status: 'disconnected',
    category: 'Finanças',
    description: 'Gerencie pedidos e produtos da sua loja WooCommerce.',
  },
]

interface DisconnectDialogProps {
  tool: Connector
  onConfirm: () => void
  onCancel: () => void
}

function DisconnectDialog({ tool, onConfirm, onCancel }: DisconnectDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <IconBubble color="rose" size="2xl">
            <Warning size={22} weight="duotone" />
          </IconBubble>
          <div>
            <h3 className="text-base font-semibold text-foreground">Desconectar ferramenta?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Esta ação pode afetar o agente</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Tem certeza que quer desconectar{' '}
          <span className="font-semibold text-foreground">{tool.name}</span>? O agente perderá
          acesso a essa integração.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
          >
            Desconectar
          </button>
        </div>
      </div>
    </div>
  )
}

type CatalogItem = (typeof CATALOG)[number]

interface AddToolDialogProps {
  catalog: CatalogItem[]
  onAdd: (tool: CatalogItem) => void
  onClose: () => void
}

function AddToolDialog({ catalog, onAdd, onClose }: AddToolDialogProps) {
  const [adding, setAdding] = useState<string | null>(null)

  function handleAdd(tool: CatalogItem) {
    setAdding(tool.id)
    setTimeout(() => {
      onAdd(tool)
      setAdding(null)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-sm flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <IconBubble color="amber" size="lg">
              <Plus size={18} weight="bold" />
            </IconBubble>
            <h3 className="text-base font-semibold text-foreground">Adicionar ferramenta</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X size={16} weight="bold" className="text-muted-foreground" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto px-4 pb-6 space-y-2">
          {catalog.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <PlugsConnected size={32} weight="duotone" className="mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm">Todas as ferramentas já estão na sua lista</p>
            </div>
          ) : (
            catalog.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-secondary border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-accent-foreground shadow-sm">
                    <ToolIcon name={tool.icon} size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(tool)}
                  disabled={adding === tool.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/80 disabled:bg-primary/50 text-primary-foreground text-xs font-medium transition-colors"
                >
                  {adding === tool.id ? (
                    <span className="flex gap-0.5 px-1">
                      <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  ) : (
                    <>
                      <Plus size={12} weight="bold" />
                      Adicionar
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export function AgentsToolsPage() {
  const [tools, setTools] = useState<Connector[]>(initialConnectors.map((c) => ({ ...c })))
  const [disconnectTarget, setDisconnectTarget] = useState<Connector | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Catalog = items not yet in tools list
  const catalog = CATALOG.filter((c) => !tools.some((t) => t.id === c.id))

  function confirmDisconnect() {
    if (!disconnectTarget) return
    setTools((prev) =>
      prev.map((t) =>
        t.id === disconnectTarget.id ? { ...t, status: 'disconnected', connectedAt: null } : t
      )
    )
    setDisconnectTarget(null)
  }

  function handleAddTool(tool: CatalogItem) {
    setTools((prev) => [
      ...prev,
      { ...tool, status: 'connected', connectedAt: new Date().toISOString() },
    ])
    if (catalog.length <= 1) setShowAddDialog(false)
  }

  const connectedCount = tools.filter((t) => t.status === 'connected').length

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      <div className="col-span-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <IconBubble color="amber" size="xl">
              <Wrench size={22} weight="duotone" />
            </IconBubble>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Minhas Ferramentas</h1>
              <p className="text-sm text-muted-foreground">
                {connectedCount} de {tools.length} conectadas
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} weight="bold" />
            <span className="hidden sm:inline">Adicionar ferramenta</span>
            <span className="sm:hidden">Adicionar</span>
          </button>
        </div>

        {/* Tools list */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="divide-y divide-border/50">
            {tools.map((tool) => (
              <div key={tool.id} className="flex items-center gap-4 px-5 py-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    tool.status === 'connected'
                      ? 'bg-secondary text-accent-foreground border border-border'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  <ToolIcon name={tool.icon} size={20} />
                </div>

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.category}</p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {tool.status === 'connected' ? (
                    <>
                      <CheckCircle size={15} weight="duotone" className="text-green-500" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 hidden sm:inline">
                        Conectado
                      </span>
                    </>
                  ) : (
                    <>
                      <Plugs size={15} weight="duotone" className="text-muted-foreground/50" />
                      <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
                        Desconectado
                      </span>
                    </>
                  )}
                </div>

                {/* Action */}
                {tool.status === 'connected' ? (
                  <button
                    onClick={() => setDisconnectTarget(tool)}
                    className="flex-shrink-0 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1.5 rounded-xl transition-colors font-medium"
                  >
                    Desconectar
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setTools((prev) =>
                        prev.map((t) =>
                          t.id === tool.id
                            ? { ...t, status: 'connected', connectedAt: new Date().toISOString() }
                            : t
                        )
                      )
                    }
                    className="flex-shrink-0 text-xs text-accent-foreground hover:text-secondary-foreground hover:bg-secondary px-2.5 py-1.5 rounded-xl transition-colors font-medium"
                  >
                    Conectar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {disconnectTarget && (
        <DisconnectDialog
          tool={disconnectTarget}
          onConfirm={confirmDisconnect}
          onCancel={() => setDisconnectTarget(null)}
        />
      )}

      {showAddDialog && (
        <AddToolDialog
          catalog={catalog}
          onAdd={handleAddTool}
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </div>
  )
}
