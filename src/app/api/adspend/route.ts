import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const whereClause: any = {}
    
    if (startDate && endDate) {
      const [startYear, startMonth, startDay] = startDate.split('-').map(Number)
      const [endYear, endMonth, endDay] = endDate.split('-').map(Number)
      
      const start = new Date(Date.UTC(startYear, startMonth - 1, startDay, 0, 0, 0, 0))
      const end = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999))
      
      whereClause.date = {
        gte: start,
        lte: end
      }
    }

    const adSpends = await prisma.adSpend.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(adSpends)
  } catch (error) {
    console.error('Error fetching ad spend data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad spend data' },
      { status: 500 }
    )
  }
} 