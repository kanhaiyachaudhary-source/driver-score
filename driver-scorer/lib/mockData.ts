// Mock MVR (Motor Vehicle Record) database — 20 hardcoded entries
// Used by the scoring engine. If a posted license_number matches one of these,
// the corresponding record is used. Otherwise, deterministic mock data is generated from a hash.

export interface MvrRecord {
  license_number: string;
  name?: string;
  years_licensed: number;
  violations: string[];
  accidents: number;
  license_status: 'Valid' | 'Suspended' | 'Expired';
  policy_status: 'Active' | 'Cancelled' | 'Lapsed' | 'Pending Cancel';
  driver_status: 'Rated' | 'Excluded' | 'Listed-only';
  special_indicators: string[];
}

export const MOCK_MVR_DATABASE: Record<string, MvrRecord> = {
  // ─── EXCELLENT DRIVERS (5) ──────────────────────────────────────────────────
  'DL-MH-001-A1': {
    license_number: 'DL-MH-001-A1',
    name: 'Rahul Sharma',
    years_licensed: 12,
    violations: [],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-DL-002-B2': {
    license_number: 'DL-DL-002-B2',
    name: 'Priya Iyer',
    years_licensed: 8,
    violations: [],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-KA-003-C3': {
    license_number: 'DL-KA-003-C3',
    name: 'Amit Patel',
    years_licensed: 15,
    violations: [],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-TN-004-D4': {
    license_number: 'DL-TN-004-D4',
    name: 'Sneha Krishnan',
    years_licensed: 10,
    violations: [],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-GJ-005-E5': {
    license_number: 'DL-GJ-005-E5',
    name: 'Vikram Mehta',
    years_licensed: 20,
    violations: [],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },

  // ─── LOW RISK (3) ───────────────────────────────────────────────────────────
  'DL-MH-006-F6': {
    license_number: 'DL-MH-006-F6',
    name: 'Ananya Reddy',
    years_licensed: 6,
    violations: ['Minor Speeding'],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-RJ-007-G7': {
    license_number: 'DL-RJ-007-G7',
    name: 'Karan Singh',
    years_licensed: 7,
    violations: ['Minor Violation'],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-WB-008-H8': {
    license_number: 'DL-WB-008-H8',
    name: 'Ritu Banerjee',
    years_licensed: 5,
    violations: [],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },

  // ─── MODERATE RISK (4) ──────────────────────────────────────────────────────
  'DL-UP-009-I9': {
    license_number: 'DL-UP-009-I9',
    name: 'Rajesh Kumar',
    years_licensed: 4,
    violations: ['Minor Speeding', 'Minor Violation'],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-TS-010-J0': {
    license_number: 'DL-TS-010-J0',
    name: 'Deepika Rao',
    years_licensed: 3,
    violations: ['Minor Speeding'],
    accidents: 1,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-KL-011-K1': {
    license_number: 'DL-KL-011-K1',
    name: 'Suresh Nair',
    years_licensed: 2,
    violations: ['Minor Speeding'],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-PB-012-L2': {
    license_number: 'DL-PB-012-L2',
    name: 'Manpreet Kaur',
    years_licensed: 5,
    violations: ['Minor Speeding', 'Minor Speeding'],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },

  // ─── HIGH RISK (5) ──────────────────────────────────────────────────────────
  'DL-HR-013-M3': {
    license_number: 'DL-HR-013-M3',
    name: 'Arjun Malhotra',
    years_licensed: 4,
    violations: ['Major Speeding', 'Minor Speeding'],
    accidents: 1,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-BR-014-N4': {
    license_number: 'DL-BR-014-N4',
    name: 'Pooja Verma',
    years_licensed: 3,
    violations: ['At-fault Accident', 'Minor Speeding'],
    accidents: 1,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-MH-015-O5': {
    license_number: 'DL-MH-015-O5',
    name: 'Ravi Joshi',
    years_licensed: 6,
    violations: ['Reckless Driving', 'Minor Speeding'],
    accidents: 1,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-KA-016-P6': {
    license_number: 'DL-KA-016-P6',
    name: 'Neha Bhatt',
    years_licensed: 2,
    violations: ['Major Speeding'],
    accidents: 0,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },
  'DL-DL-017-Q7': {
    license_number: 'DL-DL-017-Q7',
    name: 'Sandeep Gupta',
    years_licensed: 8,
    violations: ['At-fault Accident', 'At-fault Accident'],
    accidents: 2,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: [],
  },

  // ─── CRITICAL RISK (3) ──────────────────────────────────────────────────────
  'DL-XX-018-R8': {
    license_number: 'DL-XX-018-R8',
    name: 'Rohit Tiwari',
    years_licensed: 3,
    violations: ['DUI', 'Major Speeding'],
    accidents: 1,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: ['SR-22'],
  },
  'DL-YY-019-S9': {
    license_number: 'DL-YY-019-S9',
    name: 'Anil Pandey',
    years_licensed: 1,
    violations: ['Reckless Driving', 'At-fault Accident'],
    accidents: 2,
    license_status: 'Suspended',
    policy_status: 'Lapsed',
    driver_status: 'Listed-only',
    special_indicators: [],
  },
  'DL-ZZ-020-T0': {
    license_number: 'DL-ZZ-020-T0',
    name: 'Mohan Das',
    years_licensed: 5,
    violations: ['DUI', 'At-fault Accident', 'Major Speeding'],
    accidents: 2,
    license_status: 'Valid',
    policy_status: 'Active',
    driver_status: 'Rated',
    special_indicators: ['SR-22', 'Assigned Risk'],
  },
};

export function getMockMvrData(licenseNumber: string): MvrRecord {
  // Direct match in mock DB
  const exact = MOCK_MVR_DATABASE[licenseNumber.toUpperCase().trim()];
  if (exact) return exact;

  // Fallback: deterministic generation from license hash
  let hash = 0;
  for (let i = 0; i < licenseNumber.length; i++) {
    hash = ((hash << 5) - hash) + licenseNumber.charCodeAt(i);
    hash |= 0;
  }
  const scenario = Math.abs(hash) % 5;

  const fallbacks: MvrRecord[] = [
    { license_number: licenseNumber, years_licensed: 8, violations: [], accidents: 0, license_status: 'Valid', policy_status: 'Active', driver_status: 'Rated', special_indicators: [] },
    { license_number: licenseNumber, years_licensed: 5, violations: ['Minor Speeding'], accidents: 0, license_status: 'Valid', policy_status: 'Active', driver_status: 'Rated', special_indicators: [] },
    { license_number: licenseNumber, years_licensed: 4, violations: ['Minor Speeding', 'Minor Violation'], accidents: 0, license_status: 'Valid', policy_status: 'Active', driver_status: 'Rated', special_indicators: [] },
    { license_number: licenseNumber, years_licensed: 3, violations: ['Major Speeding'], accidents: 1, license_status: 'Valid', policy_status: 'Active', driver_status: 'Rated', special_indicators: [] },
    { license_number: licenseNumber, years_licensed: 2, violations: ['DUI', 'At-fault Accident'], accidents: 1, license_status: 'Valid', policy_status: 'Active', driver_status: 'Rated', special_indicators: ['SR-22'] },
  ];
  return fallbacks[scenario];
}
