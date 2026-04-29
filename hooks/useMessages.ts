'use client'

import { useState, useCallback } from 'react'
import { Message } from '@/types'

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/conversations/${conversationId}`)
      if (!res.ok) throw new Error('Failed to fetch messages')
      const data = await res.json()
      setMessages(data.messages)
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (
    message: string,
    conversationId?: string,
    systemPrompt?: string,
    personaId?: string
  ) => {
    // Optimistic update
    const tempUserMsg: Message = {
      id: 'temp-' + Date.now(),
      conversation_id: conversationId || '',
      role: 'user',
      content: message,
      tokens: 0,
      reaction: null,
      is_edited: false,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMsg])
    
    setIsStreaming(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationId, systemPrompt, personaId }),
      })

      if (!response.ok) throw new Error('Chat request failed')

      const convId = response.headers.get('X-Conversation-Id')
      const isNew = response.headers.get('X-Is-New')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          fullContent += chunk
          setStreamingContent(fullContent)
        }
      }

      setIsStreaming(false)
      setStreamingContent('')

      // Add assistant message to state
      const assistantMsg: Message = {
        id: 'final-' + Date.now(),
        conversation_id: convId || '',
        role: 'assistant',
        content: fullContent,
        tokens: 0,
        reaction: null,
        is_edited: false,
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, assistantMsg])

      // Save to database
      await fetch('/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convId,
          content: fullContent,
          isNew: isNew === 'true',
          firstMessage: message
        }),
      })

      return convId
    } catch (err: any) {
      console.error(err.message)
      setIsStreaming(false)
      throw err
    }
  }, [])

  const addReaction = useCallback(async (messageId: string, reaction: string | null) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction }),
      })
      if (!res.ok) throw new Error('Failed to add reaction')
      const updatedMessage = await res.json()
      setMessages(prev => prev.map(m => (m.id === messageId ? updatedMessage : m)))
    } catch (err: any) {
      console.error(err.message)
    }
  }, [])

  return {
    messages,
    loading,
    isStreaming,
    streamingContent,
    fetchMessages,
    sendMessage,
    addReaction,
    setMessages
  }
}
