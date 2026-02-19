import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/libs/db';

export const dynamic = 'force-dynamic';
import { companyCreateSchema } from '@/lib/validators';
import type { Company } from '@/types/company';
import type { ResultSetHeader } from 'mysql2';

export async function GET() {
  const company = await query<Company[]>('SELECT * FROM company');
  return NextResponse.json(company);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = companyCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { name, emails } = result.data;

    const queryValues: unknown[] = [];
    const insertColumns: string[] = [];

    if (name) {
      queryValues.push(name);
      insertColumns.push('name');
    }

    let emailArray: string[] = [];
    if (emails) {
      emailArray = emails.split(',').map((email) => email.trim());
      queryValues.push(JSON.stringify(emailArray));
      insertColumns.push('emails');
    }

    if (insertColumns.length === 0) {
      return NextResponse.json({ message: 'No valid data provided', status: 400 }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO company
      (${insertColumns.join(', ')})
      VALUES (${insertColumns.map(() => '?').join(', ')})
    `;

    const updateResult = await query<ResultSetHeader>(insertQuery, queryValues);

    const message = updateResult.affectedRows ? 'success' : 'error';
    const product = { name, emails: emailArray };

    return NextResponse.json({ message, status: 200, product });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const requestData = await request.json() as { id: number } & Record<string, unknown>;
    const { id, ...updateData } = requestData;

    if (id === undefined) {
      return NextResponse.json({ message: 'ID is required for updating', status: 400 }, { status: 400 });
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid update data provided', status: 400 }, { status: 400 });
    }

    const setColumns = Object.keys(updateData);
    const updateValues = Object.values(updateData);

    const updateQuery = `
      UPDATE company
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
    const deleteResult = await query<ResultSetHeader>('DELETE FROM company WHERE id = ?', [id]);

    const message = deleteResult.affectedRows ? 'success' : 'error';

    return NextResponse.json({ message, status: 200, product: { id } });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
  }
}
