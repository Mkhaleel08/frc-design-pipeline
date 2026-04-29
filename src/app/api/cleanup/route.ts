import { NextResponse } from 'next/server';
import { getAllRequests, deleteRequest } from '@/lib/db';

export async function GET() {
  try {
    const reqs = await getAllRequests();
    let deleted = 0;
    for(const r of reqs) {
      if(r.subTeam && r.subTeam !== 'CAD' && r.subTeam !== 'Mechanical') {
        await deleteRequest(r.id);
        deleted++;
      }
    }
    return NextResponse.json({ message: `Deleted ${deleted} invalid subteam requests` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
