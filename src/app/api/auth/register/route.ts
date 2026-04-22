import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, getUserCount, generateId } from '@/lib/db';
import { setSession } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, inviteCode } = body;

    if (!name || !email || !password || !inviteCode) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate invite code
    const validInviteCode = process.env.INVITE_CODE;
    if (inviteCode !== validInviteCode) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role - first user is Lead, rest are Designers
    const userCount = await getUserCount();
    const role = userCount === 0 ? 'Lead' : 'Designer';

    // Create user
    const newUser: User = {
      id: generateId(),
      email,
      name,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    await createUser(newUser);

    // Create session
    await setSession({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      accessToken: 'registered',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({ 
      ok: true, 
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
    });
  } catch (e) {
    console.error('Registration error:', e);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}