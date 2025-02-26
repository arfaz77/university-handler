'use client'
import { useState, useEffect } from 'react'
import UniversityCard from './UniversityCard'
import type { University } from '@/types'

export default function UniversityGrid() {
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch('/api/universities')
        if (!res.ok) throw new Error('Failed to fetch universities')
        const data = await res.json()
        setUniversities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUniversities()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {universities.map(university => (
        <UniversityCard key={university._id} university={university} />
      ))}
    </div>
  )
}
