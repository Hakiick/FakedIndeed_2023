import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/libs/db';

export const dynamic = 'force-dynamic';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { User } from '@/types/user';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { email, password } = result.data;

    const users = await query<User[]>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      userType: user.userType,
      name: user.name,
      lastname: user.lastname,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        name: user.name,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
  }
}
