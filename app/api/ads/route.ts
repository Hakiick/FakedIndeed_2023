import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/libs/db';

export const dynamic = 'force-dynamic';
import { jobCreateSchema } from '@/lib/validators';
import type { Job } from '@/types/job';
import type { ResultSetHeader } from 'mysql2';

export async function GET() {
  const ads = await query<Job[]>('SELECT * FROM ads');
  return NextResponse.json(ads);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = jobCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { title, description, jobTypes, minSalary, maxSalary, advantages, company, location, positionLocation } = result.data;

    const queryValues: unknown[] = [];
    const insertColumns: string[] = [];

    if (title) {
      queryValues.push(title);
      insertColumns.push('title');
    }

    if (description) {
      queryValues.push(description);
      insertColumns.push('description');
    }

    if (jobTypes) {
      queryValues.push(jobTypes);
      insertColumns.push('jobTypes');
    }

    if (minSalary !== undefined) {
      queryValues.push(minSalary);
      insertColumns.push('minSalary');
    }

    if (maxSalary !== undefined) {
      queryValues.push(maxSalary);
      insertColumns.push('maxSalary');
    }

    if (advantages !== undefined) {
      queryValues.push(advantages);
      insertColumns.push('advantages');
    }

    if (company !== undefined) {
      queryValues.push(company);
      insertColumns.push('company');
    }

    if (location !== undefined) {
      queryValues.push(location);
      insertColumns.push('location');
    }

    if (positionLocation !== undefined) {
      queryValues.push(positionLocation);
      insertColumns.push('positionLocation');
    }

    if (insertColumns.length === 0) {
      return NextResponse.json({ message: 'No valid data provided', status: 400 }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO ads
      (${insertColumns.join(', ')})
      VALUES (${insertColumns.map(() => '?').join(', ')})
    `;

    const updateResult = await query<ResultSetHeader>(insertQuery, queryValues);

    const message = updateResult.affectedRows ? 'success' : 'error';
    const product = { title, description, jobTypes, minSalary, maxSalary, advantages, company, location, positionLocation };

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
      UPDATE ads
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
    const deleteResult = await query<ResultSetHeader>('DELETE FROM ads WHERE id = ?', [id]);

    const message = deleteResult.affectedRows ? 'success' : 'error';

    return NextResponse.json({ message, status: 200, product: { id } });
  } catch (error) {
    return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
  }
}
