import { useState } from 'react'
import {
  GoogleLogo,
  WhatsappLogo,
  SlackLogo,
  Kanban,
  Database,
  WindowsLogo,
  TelegramLogo,
  Funnel,
  CreditCard,
  Receipt,
  Note,
  EnvelopeSimple,
  Plus,
  X,
  Eye,
  EyeSlash,
  Plugs,
  PlugsConnected,
  Warning,
  ArrowsClockwise,
  CheckCircle,
  Key,
  type Icon,
} from '@phosphor-icons/react'
import { connectors as mockConnectors } from '@/data'
import type { Connector, ConnectorCategory } from '@/data/types'

// ---------------------------------------------------------------------------
// Icon mapping
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, Icon> = {
  GoogleLogo,
  WhatsappLogo,
  SlackLogo,
  TrelloLogo: Kanban,
  TelegramLogo,
  MicrosoftOutlookLogo: WindowsLogo,
  Database,
  Funnel,
  CreditCard,
  Receipt,
  Note,
  EnvelopeSimple,
}

function ConnectorIcon({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) {
  const IconComp = ICON_MAP[name] ?? Plugs
  return <IconComp size={size} weight="duotone" className={className} />
}

// ---------------------------------------------------------------------------
// Catalog — extra connectors not yet added by the user
// ---------------------------------------------------------------------------
const CATALOG: Connector[] = [
  {
    id: 'cat-001',
    name: 'HubSpot',
    icon: 'Funnel',
    status: 'disconnected',
    category: 'CRM',
    description: 'CRM completo com automação de marketing e pipeline de vendas.',
    connectedAt: null,
  },
  {
    id: 'cat-002',
    name: 'Stripe',
    icon: 'CreditCard',
    status: 'disconnected',
    category: 'Finanças',
    description: 'Processamento de pagamentos, assinaturas e relatórios financeiros.',
    connectedAt: null,
  },
  {
    id: 'cat-003',
    name: 'QuickBooks',
    icon: 'Receipt',
    status: 'disconnected',
    category: 'Finanças',
    description: 'Contabilidade, faturamento e gestão financeira para PMEs.',
    connectedAt: null,
  },
  {
    id: 'cat-004',
    name: 'Notion',
    icon: 'Note',
    status: 'disconnected',
    category: 'Produtividade',
    description: 'Wiki, docs e gestão de projetos em um só lugar.',
    connectedAt: null,
  },
  {
    id: 'cat-005',
    name: 'Telegram',
    icon: 'TelegramLogo',
    status: 'disconnected',
    category: 'Comunicação',
    description: 'Notificações e alertas enviados via bots do Telegram.',
    connectedAt: null,
  },
  {
    id: 'cat-006',
    name: 'Mailchimp',
    icon: 'EnvelopeSimple',
    status: 'disconnected',
    category: 'Marketing',
    description: 'Email marketing, automações e análise de campanhas.',
    connectedAt: null,
  },
]

// ---------------------------------------------------------------------------
// Filter pills
// ---------------------------------------------------------------------------
const FILTER_PILLS: Array<ConnectorCategory | 'Todos'> = [
  'Todos',
  'Produtividade',
  'Comunicação',
  'Finanças',
]

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
function StatusBadge({ connected }: { connected: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        connected
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-slate-100 text-slate-500 border border-slate-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-400'}`}
      />
      {connected ? 'Conectado' : 'Desconectado'}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Config Panel (modal)
// ---------------------------------------------------------------------------
function ConfigPanel({
  connector,
  onClose,
  onDisconnect,
}: {
  connector: Connector
  onClose: () => void
  onDisconnect: (c: Connector) => void
}) {
  const [showKey, setShowKey] = useState(false)
  const [oauthDone, setOauthDone] = useState(connector.status === 'connected')
  const fakeKey = 'sk_live_' + connector.id.replace('-', '') + '_xxxxxxxxxxxxxxxx'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <ConnectorIcon name={connector.icon} size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{connector.name}</p>
              <p className="text-xs text-slate-400">{connector.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Status</span>
            <StatusBadge connected={connector.status === 'connected'} />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              <Key size={12} className="inline mr-1" />
              API Key
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                type={showKey ? 'text' : 'password'}
                value={fakeKey}
                className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-700 cursor-default select-all"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-2 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                title={showKey ? 'Ocultar' : 'Mostrar'}
              >
                {showKey ? <EyeSlash size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">Chave somente-leitura. Gerencie no painel do fornecedor.</p>
          </div>

          {/* OAuth */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              <ArrowsClockwise size={12} className="inline mr-1" />
              Autorização OAuth
            </label>
            <button
              onClick={() => setOauthDone(true)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                oauthDone
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                  : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {oauthDone ? (
                <>
                  <CheckCircle size={16} />
                  Autorização concedida
                </>
              ) : (
                <>
                  <ArrowsClockwise size={16} />
                  Autorizar via OAuth
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 mt-1">
              {oauthDone
                ? `Último refresh: ${new Date().toLocaleDateString('pt-BR')}`
                : 'Clique para abrir o fluxo OAuth do fornecedor.'}
            </p>
          </div>

          {connector.connectedAt && (
            <p className="text-xs text-slate-400">
              Conectado em {new Date(connector.connectedAt).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between">
          <button
            onClick={() => onDisconnect(connector)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
          >
            <Plugs size={14} />
            Desconectar
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Disconnect Confirm Dialog
// ---------------------------------------------------------------------------
function DisconnectDialog({
  connector,
  onConfirm,
  onCancel,
}: {
  connector: Connector
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Warning size={18} weight="fill" className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Desconectar {connector.name}?</p>
            <p className="text-sm text-slate-500 mt-1">
              Os agentes que usam este conector perderão acesso imediatamente. Você poderá reconectar a
              qualquer momento.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Desconectar
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Catalog Dialog
// ---------------------------------------------------------------------------
function CatalogDialog({
  catalog,
  onAdd,
  onClose,
}: {
  catalog: Connector[]
  onAdd: (c: Connector) => void
  onClose: () => void
}) {
  const [adding, setAdding] = useState<string | null>(null)

  function handleAdd(connector: Connector) {
    setAdding(connector.id)
    setTimeout(() => {
      onAdd(connector)
      setAdding(null)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <p className="text-sm font-semibold text-slate-900">Catálogo de Conectores</p>
            <p className="text-xs text-slate-400 mt-0.5">Adicione integrações ao seu workspace</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Grid */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {catalog.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-slate-400 text-sm">
              Todos os conectores disponíveis já foram adicionados.
            </div>
          ) : (
            catalog.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600">
                  <ConnectorIcon name={c.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-400 truncate">{c.description}</p>
                </div>
                <button
                  onClick={() => handleAdd(c)}
                  disabled={adding === c.id}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {adding === c.id ? (
                    <ArrowsClockwise size={12} className="animate-spin" />
                  ) : (
                    <Plus size={12} />
                  )}
                  {adding === c.id ? 'Adicionando…' : 'Adicionar'}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export function AgentsConnectorsPage() {
  const [connectors, setConnectors] = useState<Connector[]>(() => [...mockConnectors])
  const [catalog, setCatalog] = useState<Connector[]>(() => [...CATALOG])
  const [activeCategory, setActiveCategory] = useState<ConnectorCategory | 'Todos'>('Todos')
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null)
  const [disconnectTarget, setDisconnectTarget] = useState<Connector | null>(null)
  const [showCatalog, setShowCatalog] = useState(false)

  // Filtered list
  const filtered =
    activeCategory === 'Todos'
      ? connectors
      : connectors.filter((c) => c.category === activeCategory)

  // Sync selectedConnector with state (after mutations)
  const liveSelected = selectedConnector
    ? connectors.find((c) => c.id === selectedConnector.id) ?? null
    : null

  function handleDisconnectConfirm() {
    if (!disconnectTarget) return
    setConnectors((prev) =>
      prev.map((c) =>
        c.id === disconnectTarget.id ? { ...c, status: 'disconnected', connectedAt: null } : c
      )
    )
    setDisconnectTarget(null)
    setSelectedConnector(null)
  }

  function handleAddFromCatalog(connector: Connector) {
    const now = new Date().toISOString()
    const newConnector: Connector = { ...connector, status: 'connected', connectedAt: now }
    setConnectors((prev) => [...prev, newConnector])
    setCatalog((prev) => prev.filter((c) => c.id !== connector.id))
  }

  return (
    <div className="p-6 grid grid-cols-1 gap-6 items-start">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Conectores</h1>
          <p className="text-sm text-slate-500 mt-0.5">Integrações com ferramentas externas</p>
        </div>
        <button
          onClick={() => setShowCatalog(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} />
          Adicionar conector
        </button>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_PILLS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
            {cat !== 'Todos' && (
              <span className="ml-1 opacity-60">
                ({connectors.filter((c) => c.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 text-xs text-slate-500">
        <span>
          <span className="font-semibold text-slate-900">{connectors.filter((c) => c.status === 'connected').length}</span>{' '}
          conectados
        </span>
        <span>
          <span className="font-semibold text-slate-900">{connectors.filter((c) => c.status === 'disconnected').length}</span>{' '}
          desconectados
        </span>
        <span>
          <span className="font-semibold text-slate-900">{connectors.length}</span> total
        </span>
      </div>

      {/* Connectors grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <Plugs size={32} weight="duotone" className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-400">Nenhum conector nesta categoria.</p>
          <button
            onClick={() => setShowCatalog(true)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Ver catálogo completo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((connector) => (
            <div
              key={connector.id}
              onClick={() => setSelectedConnector(connector)}
              className="bg-white rounded-md border border-slate-200 p-4 shadow-sm cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <ConnectorIcon name={connector.icon} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{connector.name}</p>
                    <p className="text-xs text-slate-400">{connector.category}</p>
                  </div>
                </div>
                <StatusBadge connected={connector.status === 'connected'} />
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                {connector.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                {connector.connectedAt ? (
                  <p className="text-xs text-slate-400">
                    Desde {new Date(connector.connectedAt).toLocaleDateString('pt-BR')}
                  </p>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlugsConnected size={12} />
                  Configurar
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Config Panel */}
      {liveSelected && (
        <ConfigPanel
          connector={liveSelected}
          onClose={() => setSelectedConnector(null)}
          onDisconnect={(c) => {
            setSelectedConnector(null)
            setDisconnectTarget(c)
          }}
        />
      )}

      {/* Disconnect Confirmation */}
      {disconnectTarget && (
        <DisconnectDialog
          connector={disconnectTarget}
          onConfirm={handleDisconnectConfirm}
          onCancel={() => setDisconnectTarget(null)}
        />
      )}

      {/* Catalog Dialog */}
      {showCatalog && (
        <CatalogDialog
          catalog={catalog}
          onAdd={handleAddFromCatalog}
          onClose={() => setShowCatalog(false)}
        />
      )}
    </div>
  )
}
