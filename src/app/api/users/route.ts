import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await getAllUsers();
  
  return NextResponse.json({ 
    users: users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })) 
  });
}