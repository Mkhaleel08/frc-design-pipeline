import { NextResponse } from 'next/server';
import { updateMultipleRequests } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids, updates } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }
    
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = { ...updates };
    
    // Perform bulk update
    const updatedCount = await updateMultipleRequests(ids, updateData);

    return NextResponse.json({ success: true, count: updatedCount });
  } catch (error) {
    console.error('Failed to perform bulk update:', error);
    return NextResponse.json({ error: 'Failed to perform bulk update' }, { status: 500 });
  }
}
