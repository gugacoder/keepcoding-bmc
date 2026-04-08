import { useCallback } from 'react'
import { useContent } from '@/contexts/ContentContext'
import type { ContentItem } from '@/data/types'

export interface UseContentActions {
  contents: ContentItem[]
  aiSuggestions: ContentItem[]
  approveSuggestion: (id: string) => void
  rejectSuggestion: (id: string) => void
  updateContent: (id: string, updates: Partial<ContentItem>) => void
}

export function useContentActions(): UseContentActions {
  const { items, updateItem, removeItem } = useContent()

  const aiSuggestions = items.filter(
    (it) => it.source === 'ai' && it.status === 'rascunho'
  )

  const contents = items.filter(
    (it) => !(it.source === 'ai' && it.status === 'rascunho')
  )

  const approveSuggestion = useCallback(
    (id: string) => {
      updateItem(id, { status: 'aprovado' })
    },
    [updateItem]
  )

  const rejectSuggestion = useCallback(
    (id: string) => {
      removeItem(id)
    },
    [removeItem]
  )

  const updateContent = useCallback(
    (id: string, updates: Partial<ContentItem>) => {
      updateItem(id, updates)
    },
    [updateItem]
  )

  return {
    contents,
    aiSuggestions,
    approveSuggestion,
    rejectSuggestion,
    updateContent,
  }
}
