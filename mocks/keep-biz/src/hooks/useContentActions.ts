import { useCallback } from 'react'
import { useContent } from '@/contexts/ContentContext'
import type { ContentItem, StatusHistoryEntry } from '@/data/types'

export interface UseContentActions {
  contents: ContentItem[]
  aiSuggestions: ContentItem[]
  approveSuggestion: (id: string) => void
  rejectSuggestion: (id: string) => void
  updateContent: (id: string, updates: Partial<ContentItem>) => void
}

export function useContentActions(profileId: string | null): UseContentActions {
  const { items, updateItem, removeItem } = useContent()

  const allAiSuggestions = items.filter(
    (it) => it.source === 'ai' && it.status === 'rascunho'
  )

  const aiSuggestions = profileId !== null
    ? allAiSuggestions.filter((it) => it.profileId === profileId)
    : allAiSuggestions

  const contents = items.filter(
    (it) => !(it.source === 'ai' && it.status === 'rascunho')
  )

  const approveSuggestion = useCallback(
    (id: string) => {
      const item = items.find((it) => it.id === id)
      if (!item) return
      const entry: StatusHistoryEntry = {
        status: 'aprovado',
        timestamp: new Date().toISOString(),
        by: 'Usuário',
      }
      updateItem(id, {
        status: 'aprovado',
        statusHistory: [...item.statusHistory, entry],
      })
    },
    [items, updateItem]
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
