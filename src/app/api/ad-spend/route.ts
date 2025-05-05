import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, platform, spend, leads, ftds } = body

    const adSpend = await prisma.adSpend.create({
      data: {
        date: new Date(date),
        platform,
        spend,
        leads,
        ftds,
      },
    })

    return NextResponse.json(adSpend)
  } catch (error) {
    console.error('Error creating ad spend entry:', error)
    return NextResponse.json(
      { error: 'Failed to create ad spend entry' },
      { status: 500 }
    )
  }
} 