import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/libs/db';

export const dynamic = 'force-dynamic';
import bcrypt from 'bcryptjs';
import { userCreateSchema } from '@/lib/validators';
import type { User, UserPublic } from '@/types/user';
import type { ResultSetHeader } from 'mysql2';

export async function GET() {
  const users = await query<User[]>('SELECT id, email, userType, name, lastname, phone, website, createdAt, updatedAt FROM users');
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = userCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { email, password, userType, name, lastname, phone, website } = result.data;

    const hashedPassword = await bcrypt.hash(password, 12);

    const queryValues: unknown[] = [];
    const insertColumns: string[] = [];

    queryValues.push(email);
    insertColumns.push('email');

    queryValues.push(hashedPassword);
    insertColumns.push('password');

    queryValues.push(userType);
    insertColumns.push('userType');

    if (name !== undefined) {
      queryValues.push(name);
      insertColumns.push('name');
    }

    if (lastname !== undefined) {
      queryValues.push(lastname);
      insertColumns.push('lastname');
    }

    if (phone !== undefined) {
      queryValues.push(phone);
      insertColumns.push('phone');
    }

    if (website !== undefined) {
      queryValues.push(website);
      insertColumns.push('website');
    }

    const insertQuery = `
      INSERT INTO users
      (${insertColumns.join(', ')})
      VALUES (${insertColumns.map(() => '?').join(', ')})
    `;

    const updateResult = await query<ResultSetHeader>(insertQuery, queryValues);

    if (updateResult.affectedRows) {
      const publicUser: Partial<UserPublic> = { email, userType, name, lastname };
      return NextResponse.json({ message: 'success', status: 200, product: publicUser });
    }

    return NextResponse.json({ message: 'error', status: 500 }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const requestData = await request.json();
    const { id, ...updateData } = requestData as { id: number } & Record<string, unknown>;

    if (id === undefined) {
      return NextResponse.json({ message: 'ID is required for updating', status: 400 }, { status: 400 });
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid update data provided', status: 400 }, { status: 400 });
    }

    // Hash password if being updated
    if (typeof updateData.password === 'string' && updateData.password.length > 0) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    // Never update password with empty value
    if ('password' in updateData && !updateData.password) {
      delete updateData.password;
    }

    const setColumns = Object.keys(updateData);
    const updateValues = Object.values(updateData);

    const updateQuery = `
      UPDATE users
      SET ${setColumns.map((column) => `${column} = ?`).join(', ')}
      WHERE id = ?
    `;

    const updateResult = await query<ResultSetHeader>(updateQuery, [...updateValues, id]);

    const message = updateResult.affectedRows ? 'success' : 'error';
    const product = { id, ...updateData };

    return NextResponse.json({ message, status: 200, product });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json() as { id: number };
    const deleteResult = await query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);

    const message = deleteResult.affectedRows ? 'success' : 'error';

    return NextResponse.json({ message, status: 200, product: { id } });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
  }
}
