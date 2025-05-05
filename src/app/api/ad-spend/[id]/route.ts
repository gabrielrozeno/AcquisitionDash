import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    await prisma.adSpend.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
} 