'use client'

import { useState, useEffect, useCallback } from 'react'
import { Persona } from '@/types'

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPersonas = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/personas')
      if (!res.ok) throw new Error('Failed to fetch personas')
      const data = await res.json()
      setPersonas(data)
    } catch (err: any) {
      console.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createPersona = useCallback(async (data: Partial<Persona>) => {
    try {
      const res = await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create persona')
      const newPersona = await res.json()
      setPersonas(prev => [...prev, newPersona])
      return newPersona
    } catch (err: any) {
      console.error(err.message)
      throw err
    }
  }, [])

  const updatePersona = useCallback(async (id: string, data: Partial<Persona>) => {
    try {
      const res = await fetch(`/api/personas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update persona')
      const updated = await res.json()
      setPersonas(prev => prev.map(p => (p.id === id ? updated : p)))
      return updated
    } catch (err: any) {
      console.error(err.message)
      throw err
    }
  }, [])

  const deletePersona = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/personas/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete persona')
      setPersonas(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      console.error(err.message)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchPersonas()
  }, [fetchPersonas])

  return {
    personas,
    loading,
    fetchPersonas,
    createPersona,
    updatePersona,
    deletePersona
  }
}
