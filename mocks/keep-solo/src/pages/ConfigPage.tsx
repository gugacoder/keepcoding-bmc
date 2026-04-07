import { Gear, User, Bell, CreditCard } from '@phosphor-icons/react'

export function ConfigPage() {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center">
          <Gear size={22} weight="duotone" className="text-stone-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Config</h1>
          <p className="text-sm text-stone-400">Suas preferências</p>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-amber-50 flex items-center gap-2">
          <User size={16} weight="duotone" className="text-amber-500" />
          <h2 className="font-semibold text-stone-700">Perfil</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-500 mb-1 block">Nome</label>
            <input
              type="text"
              defaultValue="Ana Lima"
              className="w-full px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-stone-700 outline-none focus:border-amber-300 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-1 block">Email</label>
            <input
              type="email"
              defaultValue="ana@nutriana.com.br"
              className="w-full px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-stone-700 outline-none focus:border-amber-300 transition-colors"
            />
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            Salvar
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-amber-50 flex items-center gap-2">
          <Bell size={16} weight="duotone" className="text-amber-500" />
          <h2 className="font-semibold text-stone-700">Notificações</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Novo lead chegou', defaultChecked: true },
            { label: 'Agente concluiu tarefa', defaultChecked: true },
            { label: 'Conteúdo pronto para revisar', defaultChecked: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-stone-700">{item.label}</span>
              <input type="checkbox" defaultChecked={item.defaultChecked} className="accent-amber-500 w-4 h-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Plan */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-amber-50 flex items-center gap-2">
          <CreditCard size={16} weight="duotone" className="text-amber-500" />
          <h2 className="font-semibold text-stone-700">Plano</h2>
        </div>
        <div className="p-5">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 mb-4">
            <p className="text-xs text-amber-600 font-medium mb-1">Plano atual</p>
            <p className="text-lg font-bold text-stone-800">Solo Pro</p>
            <p className="text-sm text-stone-500 mt-1">1 agente · 500 ações/mês · R$ 97/mês</p>
          </div>
          <button className="w-full border border-amber-300 hover:bg-amber-50 text-amber-700 text-sm font-medium py-2.5 rounded-xl transition-colors">
            Ver planos disponíveis
          </button>
        </div>
      </div>
    </div>
  )
}
