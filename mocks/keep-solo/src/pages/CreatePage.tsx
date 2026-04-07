import { PencilSimple, Plus } from '@phosphor-icons/react'
import { contentItems } from '@/data'

const statusLabel: Record<string, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em revisão',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
  agendado: 'Agendado',
}

const statusColor: Record<string, string> = {
  rascunho: 'bg-stone-100 text-stone-600',
  em_revisao: 'bg-yellow-100 text-yellow-700',
  aprovado: 'bg-green-100 text-green-700',
  publicado: 'bg-blue-100 text-blue-700',
  agendado: 'bg-purple-100 text-purple-700',
}

export function CreatePage() {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center">
            <PencilSimple size={22} weight="duotone" className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-800">Criar</h1>
            <p className="text-sm text-stone-400">Seus conteúdos</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} weight="bold" />
          Criar post
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contentItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[item.status] ?? 'bg-stone-100 text-stone-600'}`}>
                {statusLabel[item.status] ?? item.status}
              </span>
              <span className="text-xs text-stone-400">{item.channel}</span>
            </div>
            <h3 className="font-medium text-stone-800 mb-1 leading-snug">{item.title}</h3>
            <p className="text-xs text-stone-400 capitalize">{item.type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
