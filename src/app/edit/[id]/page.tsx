import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import EditForm from './EditForm'

export default async function EditEntry({ params }: { params: { id: string } }) {
  const ad = await prisma.adSpend.findUnique({ where: { id: params.id } })
  if (!ad) return notFound()

  // Format the date for the input field (YYYY-MM-DD)
  const formattedDate = format(ad.date, 'yyyy-MM-dd')

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Entry</h1>
        <EditForm 
          id={ad.id}
          initialDate={formattedDate}
          initialPlatform={ad.platform}
          initialSpend={ad.spend}
          initialLeads={ad.leads}
          initialFtds={ad.ftds}
        />
      </div>
    </main>
  )
} 