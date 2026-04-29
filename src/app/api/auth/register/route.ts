import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, getUserCount, generateId } from '@/lib/db';
import { setSession } from '@/lib/auth';
import { User, UserRole } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { name, email, password, inviteCode } = body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password || '';
    inviteCode = inviteCode?.trim() || '';

    if (!name || name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: 'Name must be between 2 and 50 characters' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    if (!inviteCode) {
      return NextResponse.json({ error: 'Invite code is required' }, { status: 400 });
    }

    // Verify invite code and determine role
    let assignedRole: UserRole | null = null;
    
    if (inviteCode === process.env.ADMIN_INVITE_CODE) {
      assignedRole = 'Admin';
    } else if (inviteCode === process.env.SEB_INVITE_CODE) {
      assignedRole = 'Student SEB';
    } else if (inviteCode === process.env.LEAD_INVITE_CODE) {
      assignedRole = 'Project Lead';
    } else if (inviteCode === process.env.USER_INVITE_CODE) {
      assignedRole = 'Normal User';
    }

    if (!assignedRole) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser: User = {
      id: generateId(),
      email: email.slice(0, 255),
      name: name.slice(0, 50),
      password: hashedPassword,
      role: assignedRole,
      createdAt: new Date().toISOString(),
    };

    await createUser(newUser);

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