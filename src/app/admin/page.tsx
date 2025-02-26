'use client'
import { useState, useEffect } from 'react'
import UniversityForm from '@/components/admin/UniversityForm'
import type { University } from '@/types'

export default function AdminDashboard() {
  const [universities, setUniversities] = useState<University[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
console.log(universities);

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => {
        setUniversities(data)
        setIsLoading(false)
      })
      .catch(err => console.error('Error fetching universities:', err))
  }, [])

  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch(`/api/universities/${_id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setUniversities(prev => prev.filter(uni => uni._id !== _id))
      }
    } catch (error) {
      console.error('Error deleting university:', error)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <UniversityForm onSuccess={() => {
        // Refresh universities list
        fetch('/api/universities')
          .then(res => res.json())
          .then(data => setUniversities(data))
      }} />
      {/* <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Universities</h2>
        <div className="bg-white rounded-lg shadow-md">
          {universities.map(uni => (
            <div key={uni._id} className="p-4 border-b">
              <h3 className="text-lg font-medium">{uni.name}</h3>
              <div className="mt-2 space-x-2">
                <button 
                  className="text-blue-600 hover:underline"
                  onClick={() => window.location.href = `/admin/universities/${uni._id}/edit`}
                >
                  Edit
                </button>
                <button 
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(uni._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}
