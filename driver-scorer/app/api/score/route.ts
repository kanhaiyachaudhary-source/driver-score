import { NextRequest, NextResponse } from 'next/server';
import { calculateDriverScore } from '@/lib/scoring';

// Simple in-memory history (resets on server restart — fine for demo)
const history: any[] = [];

export const runtime = 'nodejs';

/**
 * POST /api/score
 *
 * Accepts EITHER:
 *   - JSON body: { name, dob, license_number, email, document_base64? }
 *   - multipart/form-data: name, dob, license_number, email, document (file)
 *
 * Returns:
 *   { request_id, name, dob, license_number, email,
 *     is_good_driver, risk_level, risk_description, driver_score,
 *     reasons, mvr_summary, scored_at }
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let name: string = '';
    let dob: string = '';
    let license_number: string = '';
    let email: string = '';
    let document_filename: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      name = (form.get('name') as string) || '';
      dob = (form.get('dob') as string) || '';
      license_number = (form.get('license_number') as string) || '';
      email = (form.get('email') as string) || '';
      const file = form.get('document') as File | null;
      if (file && typeof file.name === 'string') document_filename = file.name;
    } else {
      const body = await req.json();
      name = body.name || '';
      dob = body.dob || '';
      license_number = body.license_number || '';
      email = body.email || '';
      document_filename = body.document_filename || null;
    }

    if (!license_number || !license_number.trim()) {
      return NextResponse.json(
        { error: 'license_number is required' },
        { status: 400 }
      );
    }

    const scoring = calculateDriverScore(license_number);

    const requestId = generateRequestId(license_number);
    const response = {
      request_id: requestId,
      name: name || scoring.mvr_summary.name || null,
      dob: dob || null,
      email: email || null,
      license_number,
      document_filename,
      is_good_driver: scoring.is_good_driver,
      driver_score: scoring.driver_score,
      risk_level: scoring.risk_level,
      risk_description: scoring.risk_description,
      reasons: scoring.reasons,
      mvr_summary: scoring.mvr_summary,
      scored_at: new Date().toISOString(),
    };

    history.unshift(response);
    if (history.length > 50) history.pop();

    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Failed to process request', details: e?.message || String(e) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'driver-scoring-api',
    method: 'POST',
    description: 'POST license details (license_number required) to /api/score to get a driver score and risk level',
    example_body: {
      name: 'Rahul Sharma',
      dob: '1990-05-15',
      license_number: 'DL-MH-001-A1',
      email: 'rahul@example.com',
    },
  });
}

function generateRequestId(seed: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 6);
  return `${ts}-${rand}`.toUpperCase();
}

export function getHistory() {
  return history;
}
