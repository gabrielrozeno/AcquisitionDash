'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function updateEntry(id: string, formData: FormData) {
  const data = {
    date: formData.get('date'),
    platform: formData.get('platform'),
    spend: parseFloat(formData.get('spend') as string),
    leads: parseInt(formData.get('leads') as string),
    ftds: parseInt(formData.get('ftds') as string),
  }

  // Create date at noon UTC to avoid timezone issues
  const date = new Date(data.date as string)
  date.setUTCHours(12, 0, 0, 0)

  await prisma.adSpend.update({
    where: { id },
    data: {
      date,
      platform: data.platform as string,
      spend: data.spend,
      leads: data.leads,
      ftds: data.ftds,
    },
  })
  redirect('/')
} 