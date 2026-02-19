import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/libs/db';

export const dynamic = 'force-dynamic';
import { applicationCreateSchema } from '@/lib/validators';
import type { Application } from '@/types/application';
import type { ResultSetHeader } from 'mysql2';

export async function GET() {
  const apply = await query<Application[]>('SELECT * FROM apply');
  return NextResponse.json(apply);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = applicationCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { ad_id, company_name, name, lastname, email, phone, motivations, website, cv } = result.data;

    const queryValues: unknown[] = [];
    const insertColumns: string[] = [];

    if (ad_id) {
      queryValues.push(ad_id);
      insertColumns.push('ad_id');
    }

    if (company_name) {
      queryValues.push(company_name);
      insertColumns.push('company_name');
    }

    if (name) {
      queryValues.push(name);
      insertColumns.push('name');
    }

    if (lastname !== undefined) {
      queryValues.push(lastname);
      insertColumns.push('lastname');
    }

    if (email !== undefined) {
      queryValues.push(email);
      insertColumns.push('email');
    }

    if (phone !== undefined) {
      queryValues.push(phone);
      insertColumns.push('phone');
    }

    if (motivations !== undefined) {
      queryValues.push(motivations);
      insertColumns.push('motivations');
    }

    if (website !== undefined) {
      queryValues.push(website);
      insertColumns.push('website');
    }

    if (cv !== undefined) {
      queryValues.push(cv);
      insertColumns.push('cv');
    }

    if (insertColumns.length === 0) {
      return NextResponse.json({ message: 'No valid data provided', status: 400 }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO apply
      (${insertColumns.join(', ')})
      VALUES (${insertColumns.map(() => '?').join(', ')})
    `;

    const updateResult = await query<ResultSetHeader>(insertQuery, queryValues);

    const message = updateResult.affectedRows ? 'success' : 'error';
    const product = { ad_id, company_name, name, lastname, email, phone, motivations, website, cv };

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
      UPDATE apply
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
    const deleteResult = await query<ResultSetHeader>('DELETE FROM apply WHERE id = ?', [id]);

    const message = deleteResult.affectedRows ? 'success' : 'error';

    return NextResponse.json({ message, status: 200, product: { id } });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
  }
}
