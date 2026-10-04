import { pool } from "./db.js";

/**
 * Monthly room rates per student, in PKR.
 *
 * SAMA House is the premium branch. Jinnah House and Dr. Abdul Qadeer Khan House
 * share the standard pricing tier.
 *
 * These defaults mirror `roomRates` in `src/mocks/hostels.ts` and act as a
 * fallback when the `room_rates` table has no row for the house/capacity pair.
 */
export const DEFAULT_ROOM_RATES = {
  1: { 2: 21000, 3: 19000, 4: 18000, 5: 17000 },
  2: { 2: 25000, 3: 24000, 4: 23000, 5: 21000 },
  3: { 2: 21000, 3: 19000, 4: 18000, 5: 17000 },
};

/** Rates used when a house has no explicit entry for a capacity. */
export const FALLBACK_RATES = { 2: 21000, 3: 19000, 4: 18000, 5: 17000 };

function byCapacity(rates, capacity) {
  if (!rates) return undefined;
  const direct = rates[capacity];
  if (direct !== undefined) return direct;
  const match = Object.keys(rates).find((key) => Number(key) === Number(capacity));
  return match === undefined ? undefined : rates[match];
}

/**
 * Resolve the monthly rate for a room capacity at a given house.
 *
 * Prefers the `room_rates` table so rates stay editable, and falls back to the
 * built-in defaults if the table is missing or incomplete.
 */
export async function getRoomRate(hostelId, capacity) {
  const cap = Number(capacity);
  const fallback = byCapacity(DEFAULT_ROOM_RATES[Number(hostelId)], cap) ?? FALLBACK_RATES[cap];

  try {
    const [rows] = await pool.query(
      "SELECT rate FROM room_rates WHERE hostel_id = ? AND capacity = ? LIMIT 1",
      [hostelId, cap]
    );
    const rate = Number(rows?.[0]?.rate);
    return Number.isFinite(rate) && rate > 0 ? rate : fallback;
  } catch {
    // Table not migrated yet — use the built-in defaults.
    return fallback;
  }
}

/** Every rate for one house, keyed by capacity. Used by the public rates endpoint. */
export async function getHouseRates(hostelId) {
  const rates = { ...FALLBACK_RATES, ...(DEFAULT_ROOM_RATES[Number(hostelId)] ?? {}) };
  try {
    const [rows] = await pool.query("SELECT capacity, rate FROM room_rates WHERE hostel_id = ?", [hostelId]);
    for (const row of rows ?? []) {
      const rate = Number(row.rate);
      if (Number.isFinite(rate) && rate > 0) rates[Number(row.capacity)] = rate;
    }
  } catch {
    /* table not migrated yet — defaults are enough */
  }
  return rates;
}