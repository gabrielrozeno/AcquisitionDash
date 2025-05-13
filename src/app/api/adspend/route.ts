import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    console.log('API route called')
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    console.log('Received parameters:', { startDate, endDate })

    // First, let's check what dates we have in the database
    const allDates = await prisma.adSpend.findMany({
      select: { date: true },
      orderBy: { date: 'asc' }
    })
    console.log('All dates in database:', allDates.map(d => d.date.toISOString()))

    const whereClause: any = {}
    
    if (startDate && endDate) {
      console.log('Processing date range')
      // Create dates directly in UTC
      const [startYear, startMonth, startDay] = startDate.split('-').map(Number)
      const [endYear, endMonth, endDay] = endDate.split('-').map(Number)
      
      console.log('Parsed date components:', {
        start: { year: startYear, month: startMonth, day: startDay },
        end: { year: endYear, month: endMonth, day: endDay }
      })
      
      const start = new Date(Date.UTC(startYear, startMonth - 1, startDay, 0, 0, 0, 0))
      const end = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999))
      
      console.log('Created UTC dates:', {
        start: start.toISOString(),
        end: end.toISOString()
      })
      
      whereClause.date = {
        gte: start,
        lte: end
      }
    }

    console.log('Query where clause:', whereClause)

    const adSpends = await prisma.adSpend.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc'
      }
    })

    console.log('Query results count:', adSpends.length)

    // Log the first and last dates in the results
    if (adSpends.length > 0) {
      console.log('Results date range:', {
        first: adSpends[0].date.toISOString(),
        last: adSpends[adSpends.length - 1].date.toISOString()
      })
    }

    return NextResponse.json(adSpends)
  } catch (error) {
    console.error('Error fetching ad spend data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad spend data' },
      { status: 500 }
    )
  }
} 