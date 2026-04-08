import { createContext, useContext, useState, type ReactNode } from 'react'
import { contentItems as initialItems } from '@/data'
import type { ContentItem, ContentStatus } from '@/data/types'

interface ContentContextValue {
  items: ContentItem[]
  addItem: (item: ContentItem) => void
  updateStatus: (id: string, status: ContentStatus, extra?: Partial<ContentItem>) => void
  updateItem: (id: string, updates: Partial<ContentItem>) => void
  removeItem: (id: string) => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>(initialItems)

  function addItem(item: ContentItem) {
    setItems(prev => [item, ...prev])
  }

  function updateStatus(id: string, status: ContentStatus, extra?: Partial<ContentItem>) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status, ...extra } : i)))
  }

  function updateItem(id: string, updates: Partial<ContentItem>) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)))
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <ContentContext.Provider value={{ items, addItem, updateStatus, updateItem, removeItem }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside ContentProvider')
  return ctx
}
