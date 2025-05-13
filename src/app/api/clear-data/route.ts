import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  try {
    // Delete all records from the AdSpend table
    const deletedCount = await prisma.adSpend.deleteMany({});
    
    return NextResponse.json({ 
      message: 'All data cleared successfully',
      deletedCount: deletedCount.count
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error clearing data' },
      { status: 500 }
    );
  }
} 