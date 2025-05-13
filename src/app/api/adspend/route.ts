import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const adSpends = await prisma.adSpend.findMany({
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