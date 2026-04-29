'use client'

import { useState, useEffect, useCallback } from 'react'
import { Conversation } from '@/types'

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/conversations')
      if (!res.ok) throw new Error('Failed to fetch conversations')
      const data = await res.json()
      setConversations(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createConversation = useCallback(async (personaId?: string, systemPrompt?: string) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personaId, systemPrompt }),
      })
      if (!res.ok) throw new Error('Failed to create conversation')
      const newConversation = await res.json()
      setConversations(prev => [newConversation, ...prev])
      return newConversation
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const deleteConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete conversation')
      setConversations(prev => prev.filter(c => c.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const updateConversation = useCallback(async (id: string, data: Partial<Conversation>) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update conversation')
      const updated = await res.json()
      setConversations(prev => prev.map(c => (c.id === id ? updated : c)))
      return updated
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const pinConversation = useCallback(async (id: string, isPinned: boolean) => {
    return updateConversation(id, { is_pinned: isPinned })
  }, [updateConversation])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    deleteConversation,
    updateConversation,
    pinConversation
  }
}
