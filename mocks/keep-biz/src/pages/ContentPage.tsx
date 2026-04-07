import { contentItems } from '@/data'

const statusColor: Record<string, string> = {
  rascunho: 'bg-slate-100 text-slate-600',
  em_revisao: 'bg-amber-100 text-amber-700',
  aprovado: 'bg-emerald-100 text-emerald-700',
  publicado: 'bg-blue-100 text-blue-700',
  agendado: 'bg-purple-100 text-purple-700',
}

const statusLabel: Record<string, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em Revisão',
  aprovado: 'Aprovado',
  publicado: 'Publicado',
  agendado: 'Agendado',
}

export function ContentPage() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {/* Header */}
      <div className="col-span-full flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Content Forge</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pipeline de criação e publicação de conteúdo</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          + Nova Campanha
        </button>
      </div>

      {/* Status filters */}
      <div className="col-span-full flex gap-2 flex-wrap">
        {['Todos', 'Rascunho', 'Em Revisão', 'Aprovado', 'Publicado', 'Agendado'].map((f, i) => (
          <button
            key={f}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              i === 0
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content list */}
      {contentItems.map((item) => (
        <div key={item.id} className="bg-white rounded-md border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium text-slate-800 leading-snug">{item.title}</h3>
            <span
              className={`shrink-0 px-2 py-0.5 text-xs rounded-full font-medium ${statusColor[item.status] ?? 'bg-slate-100 text-slate-600'}`}
            >
              {statusLabel[item.status] ?? item.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{item.platform}</span>
            <span>{item.author}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.briefing}</p>
          <p className="text-xs text-slate-400 mt-2">
            Meta: {new Date(item.targetDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      ))}
    </div>
  )
}
