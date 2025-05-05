import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { format } from 'date-fns'

export default async function EditEntry({ params }: { params: { id: string } }) {
  const ad = await prisma.adSpend.findUnique({ where: { id: Number(params.id) } })
  if (!ad) return notFound()

  async function updateEntry(formData: FormData) {
    'use server'
    const data = {
      date: formData.get('date'),
      platform: formData.get('platform'),
      spend: parseFloat(formData.get('spend') as string),
      leads: parseInt(formData.get('leads') as string),
      ftds: parseInt(formData.get('ftds') as string),
    }
    await prisma.adSpend.update({
      where: { id: ad.id },
      data: {
        date: new Date(data.date as string),
        platform: data.platform as string,
        spend: data.spend,
        leads: data.leads,
        ftds: data.ftds,
      },
    })
    redirect('/')
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Entry</h1>
        <form action={updateEntry} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              required
              defaultValue={format(ad.date, 'yyyy-MM-dd')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform</label>
            <select
              id="platform"
              name="platform"
              required
              defaultValue={ad.platform}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Instagram Ads">Instagram Ads</option>
              <option value="LinkedIn Ads">LinkedIn Ads</option>
              <option value="Twitter Ads">Twitter Ads</option>
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
              defaultValue={ad.spend}
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
              defaultValue={ad.leads}
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
              defaultValue={ad.ftds}
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
      </div>
    </main>
  )
} 