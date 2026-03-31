/**
 * Unit tests for CancellationCalculation.ts
 *
 * Based on the CART Cancellation Fee Examples (Table 2):
 *   Example #1: 1-day booking, PM cancelled → 2.5h
 *   Example #2: 2-day booking, 1 day cancelled → 5h
 *   Example #3: 2-day booking, 2 days cancelled → 10h
 *   Example #4: 4-day booking, days 3-4 cancelled → 10h
 *   Example #5: 10-day booking, 8 days cancelled → 15h
 *   Example #6: 15-day booking, 13 days cancelled → 20h
 *   Example #8: 8-day (non-consecutive) booking, 7 days cancelled → 15h
 *
 * All examples use CART language type with rate $40/h.
 * Short-notice rule: ≤10 day assignments need <2 biz days notice;
 *                    >10 day assignments need <3 biz days notice.
 * Every cancelled half-day slot counts as exactly 2.5 hours.
 */

import { cancellationCalculation } from
  "@/components/tabs/components/AdmForms/AdmCalculations/CancellationCalculation";

// ── Mock the Vuex store ────────────────────────────────────────────────
// The module reads store.state.Common.rates and store.state.Common.holidays
jest.mock("@/store", () => ({
  default: {
    state: {
      Common: {
        rates: [
          { id: 1, name: "SPKL4", value: 25, previousValue: 25, valueChangedDate: "2020-01-01" },
          { id: 2, name: "SPKL3", value: 30, previousValue: 30, valueChangedDate: "2020-01-01" },
          { id: 3, name: "SPKL2", value: 35, previousValue: 35, valueChangedDate: "2020-01-01" },
          { id: 4, name: "SPKL1", value: 40, previousValue: 40, valueChangedDate: "2020-01-01" },
          { id: 5, name: "ASL2",  value: 45, previousValue: 45, valueChangedDate: "2020-01-01" },
          { id: 6, name: "ASL1",  value: 50, previousValue: 50, valueChangedDate: "2020-01-01" },
          { id: 7, name: "CART",  value: 40, previousValue: 40, valueChangedDate: "2020-01-01" },
        ],
        holidays: [],  // no holidays — we control notice days via cancellation dates
      },
    },
  },
  __esModule: true,
}));

// ── Helpers to build booking fixtures ──────────────────────────────────
const TIMEZONE = "America/Vancouver";

/** CART language stub used in every case */
const cartLanguage = {
  languageName: "CART",
  level: null,
};

/** Build a single date record */
function makeDate(
  date: string,
  startTime: string,
  finishTime: string,
  status: "Booked" | "Cancelled",
  cancellationDate?: string,
  cancellationReason?: string
) {
  return {
    date,             // ISO string, e.g. "2025-06-02T09:00:00.000-07:00"
    startTime,        // "09:00 AM"
    finishTime,       // "04:00 PM"
    status,
    cancellationDate: cancellationDate ?? null,
    cancellationReason: cancellationReason ?? null,
    cases: status === "Cancelled"
      ? [{ language: cartLanguage }]
      : [{ language: cartLanguage }],
  };
}

/**
 * Create a full-day ISO timestamp for a given YYYY-MM-DD at 9 AM Pacific.
 * This keeps our test data timezone-consistent.
 */
function isoDate(ymd: string): string {
  return `${ymd}T09:00:00.000-07:00`;
}

/** Wrap date records into a minimal booking object */
function makeBooking(
  dates: ReturnType<typeof makeDate>[],
  interpreter?: Record<string, unknown>
) {
  return {
    location: { timezone: TIMEZONE },
    dates,
    interpreter: interpreter ?? {
      gst: null,
      languageHistory: [],
    },
    admDetail: { calculations: { gst: { gstRate: "0.05" } } },
  };
}

// ── TESTS ──────────────────────────────────────────────────────────────

describe("CancellationCalculation — CART cancellation fee examples", () => {

  /**
   * Example #1 — 1-day booking, PM only cancelled
   * Booking: June 2, 2025  9:00 AM – 4:00 PM (1 full day)
   * Cancellation: June 2 afternoon (1:00 PM – 4:00 PM) cancelled on June 1
   *   → 1 half-day = 2.5h cancelled
   *   → CART ≤ 2.5h tier → totalCancelledHrMax = 3h
   *   → Fee = 3 × $40 = $120
   */
  test("Example #1: 1-day booking, PM cancelled → 3h × $40 = $120", () => {
    const dates = [
      // The AM session is still booked (not cancelled)
      makeDate(isoDate("2025-06-02"), "09:00 AM", "01:00 PM", "Booked"),
      // The PM session is cancelled with short notice (1 day = 0 biz days between)
      makeDate(
        isoDate("2025-06-02"), "01:00 PM", "04:00 PM", "Cancelled",
        isoDate("2025-06-01"), "Court cancellation"
      ),
    ];
    const booking = makeBooking(dates);
    const result = cancellationCalculation(booking, "0.05");

    expect(result.totalHours).toBe(3);
    expect(result.bestRate).toBe(40);
    expect(result.subtotalFees).toBe(120);
  });

  /**
   * Example #2 — 2-day booking, 1 full day cancelled
   * Booking: June 2-3, 2025 (9 AM – 4 PM each day)
   * Cancellation: Day 2 (June 3) fully cancelled on June 2
   *   → 1 day = 2 half-days = 5h cancelled
   *   → CART ≤ 10h tier → totalCancelledHrMax = 5.5h
   *   → Fee = 5.5 × $40 = $220
   */
  test("Example #2: 2-day booking, 1 day cancelled → 5.5h × $40 = $220", () => {
    const dates = [
      // Day 1 remains booked
      makeDate(isoDate("2025-06-02"), "09:00 AM", "04:00 PM", "Booked"),
      // Day 2 fully cancelled
      makeDate(
        isoDate("2025-06-03"), "09:00 AM", "04:00 PM", "Cancelled",
        isoDate("2025-06-02"), "Court cancellation"
      ),
    ];
    const booking = makeBooking(dates);
    const result = cancellationCalculation(booking, "0.05");

    expect(result.totalHours).toBe(5.5);
    expect(result.bestRate).toBe(40);
    expect(result.subtotalFees).toBe(220);
  });

  /**
   * Example #3 — 2-day booking, all 2 days cancelled
   * Booking: June 2-3, 2025
   * Both days cancelled on June 1
   *   → 2 days = 4 half-days = 10h cancelled
   *   → CART ≤ 10h tier → totalCancelledHrMax = 10h
   *   → Fee = 10 × $40 = $400
   */
  test("Example #3: 2-day booking, 2 days cancelled → 10h × $40 = $400", () => {
    const dates = [
      makeDate(
        isoDate("2025-06-02"), "09:00 AM", "04:00 PM", "Cancelled",
        isoDate("2025-06-01"), "Court cancellation"
      ),
      makeDate(
        isoDate("2025-06-03"), "09:00 AM", "04:00 PM", "Cancelled",
        isoDate("2025-06-01"), "Court cancellation"
      ),
    ];
    const booking = makeBooking(dates);
    const result = cancellationCalculation(booking, "0.05");

    expect(result.totalHours).toBe(10);
    expect(result.bestRate).toBe(40);
    expect(result.subtotalFees).toBe(400);
  });

  /**
   * Example #4 — 4-day booking, days 3-4 cancelled
   * Booking: June 2-5, 2025
   * Days 3-4 (June 4-5) cancelled on June 3
   *   → 2 days cancelled = 10h
   *   → Tier: 2-5 days → totalCancelledHrMax = 10h
   *   → Fee = 10 × $40 = $400
   */
  test("Example #4: 4-day booking, days 3-4 cancelled → 10h × $40 = $400", () => {
    const dates = [
      // Days 1-2 remain booked
      makeDate(isoDate("2025-06-02"), "09:00 AM", "04:00 PM", "Booked"),
      makeDate(isoDate("2025-06-03"), "09:00 AM", "04:00 PM", "Booked"),
      // Days 3-4 cancelled
      makeDate(
        isoDate("2025-06-04"), "09:00 AM", "04:00 PM", "Cancelled",
        isoDate("2025-06-03"), "Court cancellation"
      ),
      makeDate(
        isoDate("2025-06-05"), "09:00 AM", "04:00 PM", "Cancelled",
        isoDate("2025-06-03"), "Court cancellation"
      ),
    ];
    const booking = makeBooking(dates);
    const result = cancellationCalculation(booking, "0.05");

    expect(result.totalHours).toBe(10);
    expect(result.bestRate).toBe(40);
    expect(result.subtotalFees).toBe(400);
  });

  /**
   * Example #5 — 10-day booking, 8 days cancelled
   * Booking: June 2-13, 2025 (10 weekdays)
   * Days 3-10 (June 4-13) cancelled on June 3
   *   → 8 days = 40h cancelled
   *   → ≤10 day assignment, 0 biz days notice → qualifies
   *   → Tier: 6-10 days (25h < 40h ≤ 50h) → totalCancelledHrMax = 15h
   *   → Fee = 15 × $40 = $600
   */
  test("Example #5: 10-day booking, 8 days cancelled → 15h × $40 = $600", () => {
    // 10 weekdays: June 2(Mon)-6(Fri), June 9(Mon)-13(Fri)
    const weekdays = [
      "2025-06-02", "2025-06-03", "2025-06-04", "2025-06-05", "2025-06-06",
      "2025-06-09", "2025-06-10", "2025-06-11", "2025-06-12", "2025-06-13",
    ];
    const dates = weekdays.map((d, i) => {
      if (i < 2) {
        // Days 1-2 remain booked
        return makeDate(isoDate(d), "09:00 AM", "04:00 PM", "Booked");
      } else {
        // Days 3-10 cancelled on June 3
        return makeDate(
          isoDate(d), "09:00 AM", "04:00 PM", "Cancelled",
          isoDate("2025-06-03"), "Court cancellation"
        );
      }
    });
    const booking = makeBooking(dates);
    const result = cancellationCalculation(booking, "0.05");

    expect(result.totalHours).toBe(15);
    expect(result.bestRate).toBe(40);
    expect(result.subtotalFees).toBe(600);
  });

  /**
   * Example #6 — 15-day booking, 13 days cancelled
   * Booking: June 2-20, 2025 (15 weekdays)
   * Days 3-15 (June 4-20) cancelled on June 3
   *   → 13 days = 65h cancelled
   *   → >10 day assignment: needs <3 biz days notice
   *     Cancelled June 3, assignment starts June 2 → already started → 0 biz days → qualifies
   *   → Tier: 11-15 days (50h < 65h ≤ 75h) → totalCancelledHrMax = 20h
   *   → Fee = 20 × $40 = $800
   */
  test("Example #6: 15-day booking, 13 days cancelled → 20h × $40 = $800", () => {
    // 15 weekdays: June 2-6, June 9-13, June 16-20
    const weekdays = [
      "2025-06-02", "2025-06-03", "2025-06-04", "2025-06-05", "2025-06-06",
      "2025-06-09", "2025-06-10", "2025-06-11", "2025-06-12", "2025-06-13",
      "2025-06-16", "2025-06-17", "2025-06-18", "2025-06-19", "2025-06-20",
    ];
    const dates = weekdays.map((d, i) => {
      if (i < 2) {
        return makeDate(isoDate(d), "09:00 AM", "04:00 PM", "Booked");
      } else {
        return makeDate(
          isoDate(d), "09:00 AM", "04:00 PM", "Cancelled",
          isoDate("2025-06-03"), "Court cancellation"
        );
      }
    });
    const booking = makeBooking(dates);
    const result = cancellationCalculation(booking, "0.05");

    expect(result.totalHours).toBe(20);
    expect(result.bestRate).toBe(40);
    expect(result.subtotalFees).toBe(800);
  });

  /**
   * Example #8 — 8-day non-consecutive booking, 7 days cancelled
   * Booking: 8 non-consecutive days over weeks
   * 7 of those days cancelled
   *   → 7 days = 35h cancelled
   *   → 8 unique assignment → needs <2 biz days notice
   *   → Tier: 6-10 days (25h < 35h ≤ 50h) → totalCancelledHrMax = 15h
   *   → Fee = 15 × $40 = $600
   */
  test("Example #8: 8-day non-consecutive, 7 cancelled → 15h × $40 = $600", () => {
    // Spread across 3 weeks with gaps (non-consecutive)
    const allDays = [
      "2025-06-02", // Mon wk1
      "2025-06-04", // Wed wk1
      "2025-06-06", // Fri wk1
      "2025-06-10", // Tue wk2
      "2025-06-12", // Thu wk2
      "2025-06-16", // Mon wk3
      "2025-06-18", // Wed wk3
      "2025-06-20", // Fri wk3
    ];
    const dates = allDays.map((d, i) => {
      if (i === 0) {
        // Day 1 remains booked
        return makeDate(isoDate(d), "09:00 AM", "04:00 PM", "Booked");
      } else {
        // Days 2-8 cancelled on June 2 (same day as assignment start → 0 biz days)
        return makeDate(
          isoDate(d), "09:00 AM", "04:00 PM", "Cancelled",
          isoDate("2025-06-02"), "Court cancellation"
        );
      }
    });
    const booking = makeBooking(dates);
    const result = cancellationCalculation(booking, "0.05");

    expect(result.totalHours).toBe(15);
    expect(result.bestRate).toBe(40);
    expect(result.subtotalFees).toBe(600);
  });
});