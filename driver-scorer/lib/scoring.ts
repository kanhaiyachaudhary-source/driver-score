import { MvrRecord, getMockMvrData } from './mockData';

// ─── 10-LEVEL RISK CLASSIFICATION ───────────────────────────────────────────
// Lower score = better driver.
// is_good_driver flag is true if score < GOOD_DRIVER_THRESHOLD (40)
export const RISK_LEVELS = [
  { max: 5,   level: 'Excellent',     description: 'Exemplary driving record' },
  { max: 15,  level: 'Very Low',      description: 'Minimal risk profile' },
  { max: 25,  level: 'Low',           description: 'Below average risk' },
  { max: 35,  level: 'Moderate-Low',  description: 'Slightly below average risk' },
  { max: 50,  level: 'Moderate',      description: 'Average risk profile' },
  { max: 65,  level: 'Considerable',  description: 'Above average risk' },
  { max: 75,  level: 'Elevated',      description: 'Notably elevated risk' },
  { max: 85,  level: 'High',          description: 'High risk profile' },
  { max: 95,  level: 'Very High',     description: 'Significantly elevated risk' },
  { max: 100, level: 'Critical',      description: 'Severe risk — immediate review required' },
] as const;

export const GOOD_DRIVER_THRESHOLD = 40;

const VIOLATION_WEIGHTS: Record<string, number> = {
  'DUI':                100,
  'Suspended License':   95,
  'Reckless Driving':    90,
  'At-fault Accident':   80,
  'Major Speeding':      70,
  'Minor Speeding':      20,
  'Minor Violation':     15,
};

const RULES = {
  min_licensed_years: 3,
  max_minor_violations: 1,
};

export interface ScoringResult {
  driver_score: number;
  is_good_driver: boolean;
  risk_level: string;
  risk_description: string;
  reasons: string[];
  mvr_summary: MvrRecord;
}

export function calculateDriverScore(licenseNumber: string): ScoringResult {
  const mvr = getMockMvrData(licenseNumber);
  let score = 0;
  const reasons: string[] = [];

  // Penalty: Short licensed duration
  if (mvr.years_licensed < RULES.min_licensed_years) {
    const penalty = (RULES.min_licensed_years - mvr.years_licensed) * 15;
    score += penalty;
    reasons.push(`Licensed only ${mvr.years_licensed} year(s), minimum ${RULES.min_licensed_years} (+${penalty})`);
  }

  // Violations
  let minorCount = 0;
  for (const v of mvr.violations) {
    const weight = VIOLATION_WEIGHTS[v] || 0;
    score += weight;
    reasons.push(`${v} (+${weight})`);
    if (weight <= 25) minorCount++;
  }

  // Cap on minor violations
  if (minorCount > RULES.max_minor_violations) {
    const extra = (minorCount - RULES.max_minor_violations) * 20;
    score += extra;
    reasons.push(`${minorCount} minor violations exceeds cap of ${RULES.max_minor_violations} (+${extra})`);
  }

  // Accidents
  if (mvr.accidents > 0) {
    const accPenalty = mvr.accidents * 30;
    score += accPenalty;
    reasons.push(`${mvr.accidents} accident(s) on record (+${accPenalty})`);
  }

  // License status
  if (mvr.license_status !== 'Valid') {
    score += 50;
    reasons.push(`License status: ${mvr.license_status} (+50)`);
  }

  // Policy status
  if (mvr.policy_status !== 'Active') {
    score += 25;
    reasons.push(`Policy status: ${mvr.policy_status} (+25)`);
  }

  // Driver status
  if (mvr.driver_status !== 'Rated') {
    score += 30;
    reasons.push(`Driver status: ${mvr.driver_status} (+30)`);
  }

  // Special indicators
  for (const ind of mvr.special_indicators) {
    score += 25;
    reasons.push(`${ind} indicator present (+25)`);
  }

  // Cap at 100
  score = Math.min(100, score);

  // Determine risk level
  const tier = RISK_LEVELS.find(t => score <= t.max) || RISK_LEVELS[RISK_LEVELS.length - 1];
  const is_good_driver = score < GOOD_DRIVER_THRESHOLD;

  if (reasons.length === 0) {
    reasons.push('Clean driving record — no violations or accidents');
  }

  return {
    driver_score: score,
    is_good_driver,
    risk_level: tier.level,
    risk_description: tier.description,
    reasons,
    mvr_summary: mvr,
  };
}
