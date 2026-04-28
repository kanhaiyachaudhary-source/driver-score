import { NextResponse } from 'next/server';
import { MOCK_MVR_DATABASE } from '@/lib/mockData';

export const runtime = 'nodejs';

export async function GET() {
  const samples = Object.values(MOCK_MVR_DATABASE).map(r => ({
    license_number: r.license_number,
    name: r.name,
  }));
  return NextResponse.json(samples);
}
