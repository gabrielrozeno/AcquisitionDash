'use client'

import { useRouter } from 'next/navigation'

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`/api/ad-spend/${id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete entry')
        }
        
        router.refresh()
      } catch (error) {
        console.error('Error deleting entry:', error)
        alert('Failed to delete entry. Please try again.')
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline"
    >
      Delete
    </button>
  )
} 