/**
 * Compatibility Score Calculator
 *
 * Computes a 0–100 match percentage between the current user's preferences
 * and a candidate profile. Each criterion carries a configurable weight.
 *
 * Weights (total = 100):
 *   Religiosity  25
 *   Sect         20
 *   Age          15
 *   City         10
 *   Education    10
 *   Cast          5
 *   Marital       5
 *   Verified      5
 *   Height        5
 */

// ---------- types (plain objects, no TS) ----------

/*
  UserPreferences {
    ageMin?: number,
    ageMax?: number,
    city?: string,           // "Any" or a city name
    sect?: string,           // "Any" | "Sunni" | ...
    cast?: string,           // "Any" | "Rajput" | ...
    education?: string,      // "Any" | "Bachelors" | ...
    maritalStatus?: string,  // "Any" | "Never Married" | ...
    religiosity?: string,    // "Practicing" | "Very Practicing" | ...
    minHeight?: number,      // feet, e.g. 5.4
    preferVerified?: boolean,
  }

  CandidateProfile {
    age: number,
    city: string,
    sect: string,
    cast: string,
    education: string,
    religiosity: string,
    maritalStatus?: string,
    height?: number,
    verified: boolean,
  }
*/

// ---- internal helpers ----

const WEIGHTS = {
  religiosity: 25,
  sect: 20,
  age: 15,
  city: 10,
  education: 10,
  cast: 5,
  maritalStatus: 5,
  verified: 5,
  height: 5,
};

const EDUCATION_RANK = {
  matric: 1,
  intermediate: 2,
  bachelors: 3,
  masters: 4,
  phd: 5,
  "islamic scholar": 5,
};

const RELIGIOSITY_RANK = {
  "not practicing": 1,
  moderate: 2,
  practicing: 3,
  "very practicing": 4,
};

function norm(str) {
  return (str || "").trim().toLowerCase();
}

function isAny(val) {
  return !val || norm(val) === "any" || norm(val) === "";
}

// ---- score per criterion (0..1) ----

function scoreAge(pref, candidate) {
  const min = pref.ageMin ?? 18;
  const max = pref.ageMax ?? 60;
  if (candidate.age >= min && candidate.age <= max) return 1;
  const dist = candidate.age < min ? min - candidate.age : candidate.age - max;
  // graceful falloff: lose 15% per year outside range
  return Math.max(0, 1 - dist * 0.15);
}

function scoreExact(prefVal, candidateVal) {
  if (isAny(prefVal)) return 1;
  return norm(prefVal) === norm(candidateVal) ? 1 : 0;
}

function scoreRanked(prefVal, candidateVal, rankMap) {
  if (isAny(prefVal)) return 1;
  const pRank = rankMap[norm(prefVal)] ?? 3;
  const cRank = rankMap[norm(candidateVal)] ?? 3;
  if (pRank === cRank) return 1;
  const diff = Math.abs(pRank - cRank);
  return Math.max(0, 1 - diff * 0.35);
}

function scoreVerified(pref, candidate) {
  if (!pref.preferVerified) return 1;
  return candidate.verified ? 1 : 0.3;
}

function scoreHeight(pref, candidate) {
  if (!pref.minHeight || !candidate.height) return 1; // no data = neutral
  if (candidate.height >= pref.minHeight) return 1;
  const diff = pref.minHeight - candidate.height;
  return Math.max(0, 1 - diff * 0.3);
}

// ---- main export ----

/**
 * Calculate compatibility percentage (0–100) between user preferences
 * and a candidate profile.
 */
export function calculateCompatibility(preferences, candidate) {
  const scores = {
    religiosity: scoreRanked(preferences.religiosity, candidate.religiosity, RELIGIOSITY_RANK),
    sect: scoreExact(preferences.sect, candidate.sect),
    age: scoreAge(preferences, candidate),
    city: scoreExact(preferences.city, candidate.city),
    education: scoreRanked(preferences.education, candidate.education, EDUCATION_RANK),
    cast: scoreExact(preferences.cast, candidate.cast),
    maritalStatus: scoreExact(preferences.maritalStatus, candidate.maritalStatus),
    verified: scoreVerified(preferences, candidate),
    height: scoreHeight(preferences, candidate),
  };

  let total = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    total += (scores[key] ?? 1) * weight;
    weightSum += weight;
  }

  return Math.round((total / weightSum) * 100);
}

/**
 * Return a breakdown object: { criterion: { score, weight, weighted } }
 * Useful for showing users *why* they matched.
 */
export function getCompatibilityBreakdown(preferences, candidate) {
  const raw = {
    religiosity: scoreRanked(preferences.religiosity, candidate.religiosity, RELIGIOSITY_RANK),
    sect: scoreExact(preferences.sect, candidate.sect),
    age: scoreAge(preferences, candidate),
    city: scoreExact(preferences.city, candidate.city),
    education: scoreRanked(preferences.education, candidate.education, EDUCATION_RANK),
    cast: scoreExact(preferences.cast, candidate.cast),
    maritalStatus: scoreExact(preferences.maritalStatus, candidate.maritalStatus),
    verified: scoreVerified(preferences, candidate),
    height: scoreHeight(preferences, candidate),
  };

  const breakdown = {};
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const score = raw[key] ?? 1;
    breakdown[key] = {
      score: Math.round(score * 100),
      weight,
      weighted: Math.round(score * weight),
    };
  }
  return breakdown;
}

/**
 * Labels and colors for score tiers.
 */
export function getScoreTier(score) {
  if (score >= 90) return { label: "Excellent Match", color: "text-primary", bg: "bg-primary/15" };
  if (score >= 75) return { label: "Great Match", color: "text-primary", bg: "bg-primary/10" };
  if (score >= 60) return { label: "Good Match", color: "text-accent-foreground", bg: "bg-accent/15" };
  if (score >= 40) return { label: "Fair Match", color: "text-muted-foreground", bg: "bg-muted" };
  return { label: "Low Match", color: "text-muted-foreground", bg: "bg-muted" };
}

/**
 * Human-friendly criterion labels.
 */
export const CRITERION_LABELS = {
  religiosity: "Religious Practice",
  sect: "Sect / Maslak",
  age: "Age Range",
  city: "Location",
  education: "Education",
  cast: "Cast / Biradari",
  maritalStatus: "Marital Status",
  verified: "Verification",
  height: "Height",
};
