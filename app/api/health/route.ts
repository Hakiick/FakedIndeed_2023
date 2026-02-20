import { NextResponse } from 'next/server';
import pool from '@/libs/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await pool.execute('SELECT 1 as health');
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
