'use client'

import { updateEntry } from '@/app/actions'

interface EditFormProps {
  id: string
  initialDate: string
  initialPlatform: string
  initialSpend: number
  initialLeads: number
  initialFtds: number
}

export default function EditForm({
  id,
  initialDate,
  initialPlatform,
  initialSpend,
  initialLeads,
  initialFtds,
}: EditFormProps) {
  return (
    <form action={async (formData: FormData) => updateEntry(id, formData)} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          required
          defaultValue={initialDate}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform</label>
        <select
          id="platform"
          name="platform"
          required
          defaultValue={initialPlatform}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
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
        <label htmlFor="spend" className="block text-sm font-medium text-gray-700">Daily Spend ($)</label>
        <input
          type="number"
          id="spend"
          name="spend"
          step="0.01"
          min="0"
          required
          defaultValue={initialSpend}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="leads" className="block text-sm font-medium text-gray-700">Number of Leads</label>
        <input
          type="number"
          id="leads"
          name="leads"
          min="0"
          required
          defaultValue={initialLeads}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="ftds" className="block text-sm font-medium text-gray-700">Number of FTDs</label>
        <input
          type="number"
          id="ftds"
          name="ftds"
          min="0"
          required
          defaultValue={initialFtds}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
} 