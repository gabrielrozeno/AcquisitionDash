import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import DeleteButton from './components/DeleteButton'
import FilterBar from './components/FilterBar'

export default async function Home({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string; platform?: string }
}) {
  // Get unique platforms for the filter dropdown
  const platforms = await prisma.adSpend.findMany({
    select: { platform: true },
    distinct: ['platform'],
  })

  // Build the where clause for filtering
  const where: any = {}
  if (searchParams.startDate) {
    const startDate = new Date(searchParams.startDate)
    startDate.setUTCHours(0, 0, 0, 0)
    where.date = { ...where.date, gte: startDate }
  }
  if (searchParams.endDate) {
    const endDate = new Date(searchParams.endDate)
    endDate.setUTCHours(23, 59, 59, 999)
    where.date = { ...where.date, lte: endDate }
  }
  if (searchParams.platform) {
    where.platform = searchParams.platform
  }

  const adSpends = await prisma.adSpend.findMany({
    where,
    orderBy: {
      date: 'desc'
    }
  })

  const totalSpend = adSpends.reduce((sum, ad) => sum + ad.spend, 0)
  const totalLeads = adSpends.reduce((sum, ad) => sum + ad.leads, 0)
  const totalFtds = adSpends.reduce((sum, ad) => sum + ad.ftds, 0)

  const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0
  const cpf = totalFtds > 0 ? totalSpend / totalFtds : 0

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">RVBet Dashboard</h1>
          <Link
            href="/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add New Entry
          </Link>
        </div>

        <FilterBar platforms={platforms.map(p => p.platform)} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard title="Total Spend" value={`$${totalSpend.toFixed(2)}`} />
          <MetricCard title="Total Leads" value={totalLeads.toString()} />
          <MetricCard title="Total FTDs" value={totalFtds.toString()} />
          <MetricCard title="CPL" value={`$${cpl.toFixed(2)}`} />
          <MetricCard title="Cost per FTD" value={`$${cpf.toFixed(2)}`} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          {adSpends.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No entries found. Try adjusting your filters or add a new entry.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Platform</th>
                    <th className="text-right py-2">Spend</th>
                    <th className="text-right py-2">Leads</th>
                    <th className="text-right py-2">FTDs</th>
                    <th className="text-right py-2">CPL</th>
                    <th className="text-right py-2">Cost per FTD</th>
                    <th className="text-right py-2">Edit</th>
                    <th className="text-right py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {adSpends.map((ad) => {
                    const adCpl = ad.leads > 0 ? ad.spend / ad.leads : 0
                    const adCpf = ad.ftds > 0 ? ad.spend / ad.ftds : 0
                    
                    return (
                      <tr key={ad.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{format(ad.date, 'MMM d, yyyy')}</td>
                        <td className="py-2">{ad.platform}</td>
                        <td className="text-right py-2">${ad.spend.toFixed(2)}</td>
                        <td className="text-right py-2">{ad.leads}</td>
                        <td className="text-right py-2">{ad.ftds}</td>
                        <td className="text-right py-2">${adCpl.toFixed(2)}</td>
                        <td className="text-right py-2">${adCpf.toFixed(2)}</td>
                        <td className="text-right py-2">
                          <Link href={`/edit/${ad.id}`} className="text-blue-600 hover:underline">Edit</Link>
                        </td>
                        <td className="text-right py-2">
                          <DeleteButton id={ad.id} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  )
} 