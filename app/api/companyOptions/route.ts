import { NextResponse } from 'next/server';
import { query } from '@/libs/db';

export const dynamic = 'force-dynamic';

interface CompanyOption {
  company_id: number;
  name: string;
  email: string;
}

export async function GET() {
  const company = await query<CompanyOption[]>(
    "SELECT c.id AS company_id, c.name, u.email FROM company AS c JOIN users AS u ON c.emails LIKE CONCAT('%', u.email, '%') WHERE c.emails IS NOT NULL;"
  );
  return NextResponse.json(company);
}
