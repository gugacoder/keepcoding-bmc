import { createContext, useContext, useState, type ReactNode } from 'react'
import { contentItems as initialItems } from '@/data'
import type { ContentItem, ContentStatus } from '@/data/types'

interface ContentContextValue {
  items: ContentItem[]
  addItem: (item: ContentItem) => void
  updateStatus: (id: string, status: ContentStatus) => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>(initialItems)

  function addItem(item: ContentItem) {
    setItems((prev) => [item, ...prev])
  }

  function updateStatus(id: string, status: ContentStatus) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, status } : it))
  }

  return (
    <ContentContext.Provider value={{ items, addItem, updateStatus }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside ContentProvider')
  return ctx
}
