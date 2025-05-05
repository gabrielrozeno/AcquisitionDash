'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddEntry() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      date: formData.get('date'),
      platform: formData.get('platform'),
      spend: parseFloat(formData.get('spend') as string),
      leads: parseInt(formData.get('leads') as string),
      ftds: parseInt(formData.get('ftds') as string),
    }

    try {
      const response = await fetch('/api/ad-spend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to add entry')
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error adding entry:', error)
      alert('Failed to add entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold">Add New Entry</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a platform</option>
                <option value="PushHouse">PushHouse</option>
                <option value="AdCash">AdCash</option>
                <option value="Evadav">Evadav</option>
                <option value="RichAds">RichAds</option>
                <option value="Adsterra">Adsterra</option>
                <option value="PropellerAds">PropellerAds</option>
                <option value="Pushground">Pushground</option>
                <option value="TrafficJunky">TrafficJunky</option>
                <option value="TrafficFactory">Traffic Factory</option>
              </select>
            </div>

            <div>
              <label htmlFor="spend" className="block text-sm font-medium text-gray-700">
                Daily Spend ($)
              </label>
              <input
                type="number"
                id="spend"
                name="spend"
                step="0.01"
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="leads" className="block text-sm font-medium text-gray-700">
                Number of Leads
              </label>
              <input
                type="number"
                id="leads"
                name="leads"
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="ftds" className="block text-sm font-medium text-gray-700">
                Number of FTDs
              </label>
              <input
                type="number"
                id="ftds"
                name="ftds"
                min="0"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
} 