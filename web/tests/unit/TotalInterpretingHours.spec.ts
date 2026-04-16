/**
 * Test for getTotalInterpretingHours using real booking data from test environment.
 *
 * Booking : Mandarin level 1
 * Location: Vancouver Law Courts (timezone: America/Vancouver)
 *
 * Key characteristic: interpreter.languageHistory is null
 
 * 38 total date records:
 *   15 Booked sessions across 8 unique dates
 *   23 Cancelled sessions
 *
 * Booked dates:
 *   Jan 12: AM + PM = 5.0h
 *   Jan 13: AM only = 2.5h
 *   Jan 15: AM + PM = 5.0h
 *   Jan 20: AM + PM = 5.0h
 *   Jan 22: AM + PM = 5.0h
 *   Jan 26: AM + PM = 5.0h
 *   Jan 27: AM + PM = 5.0h
 *   Jan 29: AM + PM = 5.0h
 *   ──────────────────────────
 *   Expected total: 37.5 hours under SPKL1
 */

// moment-timezone CJS interop for ts-jest
jest.mock("moment-timezone", () => {
  const actual = jest.requireActual("moment-timezone");
  return { __esModule: true, default: actual };
});

import { getTotalInterpretingHours } from
  "@/components/tabs/components/AdmForms/AdmCalculations/TotalInterpretingHours";

// ── Mock the Vuex store ────────────────────────────────────────────────
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
        holidays: [],
      },
    },
  },
  __esModule: true,
}));

// ── Helpers ────────────────────────────────────────────────────────────

const MANDARIN_LANG = {
  id: 73,
  languageId: 56,
  level: 1,
  languageName: "Mandarin",
  commentOnLevel: null,
};

function makeDateRecord(
  id: number,
  caseId: number,
  date: string,
  startTime: string,
  finishTime: string,
  actualStartTime: string | null,
  actualFinishTime: string | null,
  status: "Booked" | "Cancelled",
  cancellationReason: string | null = null,
) {
  return {
    id,
    date,
    cases: [{
      id: caseId,
      file: "423134",
      caseName: "TEST CASE",
      room: "200",
      caseType: "Criminal",
      courtLevel: "Provincial",
      courtClass: "Adult",
      courtClassOther: "",
      reason: "CLC",
      reasonOther: "",
      bilingual: false,
      interpretationMode: "",
      language: { ...MANDARIN_LANG },
      interpretFor: "Accused",
      federal: false,
      prosecutor: "",
      remoteRegistry: "",
      remoteLocationId: 76,
      vanRegistry: "",
      vanLocationId: 76,
      antcpStartTime: startTime,
      justinNo: null,
      physicalFileId: null,
      appearanceId: null,
      requestedBy: "Court",
      methodOfAppearance: "In-Person",
    }],
    startTime,
    finishTime,
    actualStartTime,
    actualFinishTime,
    approversInitials: status === "Booked" ? "j" : null,
    cancellationReason,
    cancellationComment: cancellationReason ? "" : null,
    cancellationDate: cancellationReason ? "2026-02-05T21:00:00+00:00" : null,
    cancellationTime: cancellationReason ? "01:00 PM" : null,
    cancellationFee: null,
    comment: null,
    methodOfAppearance: "In-Person",
    status,
    languages: null,
  };
}

// ── Real booking data from test environment (Booking 268) ──────────────

const bookingDates = [
  // Booked sessions (15)
  makeDateRecord(787, 892, "2026-01-12T08:00:00+00:00", "09:30 AM", "12:00 PM", "09:30 AM", "12:00 PM", "Booked"),
  makeDateRecord(788, 893, "2026-01-12T08:00:00+00:00", "01:30 PM", "04:00 PM", "01:30 PM", "04:00 PM", "Booked"),
  makeDateRecord(789, 894, "2026-01-13T08:00:00+00:00", "09:30 AM", "12:00 PM", "09:30 AM", "12:00 PM", "Booked"),
  makeDateRecord(793, 898, "2026-01-15T08:00:00+00:00", "09:30 AM", "12:00 PM", "09:30 AM", "12:00 PM", "Booked"),
  makeDateRecord(794, 899, "2026-01-15T08:00:00+00:00", "01:30 PM", "04:00 PM", "01:30 PM", "04:00 PM", "Booked"),
  makeDateRecord(799, 904, "2026-01-20T08:00:00+00:00", "09:30 AM", "12:00 PM", "09:30 AM", "12:00 PM", "Booked"),
  makeDateRecord(800, 905, "2026-01-20T08:00:00+00:00", "01:30 PM", "04:00 PM", "01:30 PM", "04:00 PM", "Booked"),
  makeDateRecord(803, 908, "2026-01-22T08:00:00+00:00", "09:30 AM", "12:00 PM", "09:30 AM", "12:00 PM", "Booked"),
  makeDateRecord(804, 909, "2026-01-22T08:00:00+00:00", "01:30 PM", "04:00 PM", "01:30 PM", "04:00 PM", "Booked"),
  makeDateRecord(807, 912, "2026-01-26T08:00:00+00:00", "09:30 AM", "12:00 PM", "09:30 AM", "12:00 PM", "Booked"),
  makeDateRecord(808, 913, "2026-01-26T08:00:00+00:00", "01:30 PM", "04:00 PM", "01:30 PM", "04:00 PM", "Booked"),
  makeDateRecord(809, 914, "2026-01-27T08:00:00+00:00", "09:30 AM", "12:00 PM", "09:30 AM", "12:00 PM", "Booked"),
  makeDateRecord(810, 915, "2026-01-27T08:00:00+00:00", "01:30 PM", "04:00 PM", "01:30 PM", "04:00 PM", "Booked"),
  makeDateRecord(813, 918, "2026-01-29T08:00:00+00:00", "09:30 AM", "12:00 PM", "09:30 AM", "12:00 PM", "Booked"),
  makeDateRecord(814, 919, "2026-01-29T08:00:00+00:00", "01:30 PM", "04:00 PM", "01:30 PM", "04:00 PM", "Booked"),

  // Cancelled sessions (23)
  makeDateRecord(792, 897, "2026-01-14T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(812, 917, "2026-01-28T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(815, 920, "2026-01-30T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(817, 922, "2026-02-02T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(818, 923, "2026-02-02T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(820, 925, "2026-02-03T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(821, 926, "2026-02-04T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(797, 902, "2026-01-19T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(801, 906, "2026-01-21T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(802, 907, "2026-01-21T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(806, 911, "2026-01-23T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(822, 927, "2026-02-04T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(823, 928, "2026-02-06T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(824, 929, "2026-02-06T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(791, 896, "2026-01-14T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(796, 901, "2026-01-16T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(795, 900, "2026-01-16T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(798, 903, "2026-01-19T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(805, 910, "2026-01-23T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(790, 895, "2026-01-13T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(811, 916, "2026-01-28T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(816, 921, "2026-01-30T08:00:00+00:00", "01:30 PM", "04:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
  makeDateRecord(819, 924, "2026-02-03T08:00:00+00:00", "09:30 AM", "12:00 PM", null, null, "Cancelled", "Court (Adjourned)"),
];

const booking = {
  id: 268,
  schedulingClerk: "System Admin",
  clerkPhone: null,
  interpreter: {
    id: 45,
    lastName: "test",
    firstName: "Tasty",
    phone: "123-123-1234",
    email: "tasty@test.com",
    languages: [{ ...MANDARIN_LANG }],
    languageHistory: null as unknown as any[],
  },
  location: {
    id: 76,
    name: "Vancouver Law Courts",
    addressLine: "Cherry St.",
    city: "City of Vancouver",
    postalCode: "V1V 1V1",
    province: "BC",
    region_id: 2,
    longitude: -123.12070930000001,
    latitude: 49.27624570000001,
    shortDescription: "VLC",
    timezone: "America/Vancouver",
  },
  dates: bookingDates,
  recordsApproved: true,
  created_at: "2026-02-05T20:59:25.013962+00:00",
  updated_by: "System Admin",
};

// ── TESTS ──────────────────────────────────────────────────────────────

describe("TotalInterpretingHours — Booking", () => {

  test("precondition: 38 total date records (15 Booked + 23 Cancelled)", () => {
    expect(bookingDates).toHaveLength(38);
    expect(bookingDates.filter(d => d.status === "Booked")).toHaveLength(15);
    expect(bookingDates.filter(d => d.status === "Cancelled")).toHaveLength(23);
  });

  test("total interpreting hours should be 37.5h under SPKL1", () => {
    const result = getTotalInterpretingHours(booking);
    //console.log("result:", JSON.stringify(result, null, 2));
    

    // 7 full days (AM+PM) × 5.0h + 1 half day (AM only) × 2.5h = 37.5h
    expect(result.totalHours.SPKL1).toBe(37.5);
  });

  test("no old-rate or other language-type hours should be present", () => {
    const result = getTotalInterpretingHours(booking);

    expect(result.totalHours.OldSPKL1).toBe(0);
    expect(result.totalHours.SPKL2).toBe(0);
    expect(result.totalHours.SPKL3).toBe(0);
    expect(result.totalHours.SPKL4).toBe(0);
    expect(result.totalHours.ASL1).toBe(0);
    expect(result.totalHours.ASL2).toBe(0);
    expect(result.totalHours.CART).toBe(0);
  });

  test("dailyInterpretingHours should be null (no session exceeds threshold)", () => {
    const result = getTotalInterpretingHours(booking);
    expect(result.dailyInterpretingHours).toBeNull();
  });
});

// ── Variant: exceeded session, trigger dailyInterpretingHours ───────
//
// Same booking but with an extra 8-hour and 25-min (8.42 get rounded to 8.5h) session added on Jan 30.
//
// Updated totals: 37.5 + 8.5 = 46.0h under SPKL1

const extraSessionDates = [
  ...bookingDates,
  // Extra 1h session on Jan 30 (02:00 PM – 04:30 PM with actual 01:45 PM – 10:10 PM)
  makeDateRecord(900, 950, "2026-01-30T08:00:00+00:00", "02:00 PM", "04:30 PM", "01:45 PM", "10:10 PM", "Booked"),
];

const bookingWithExtraSessions = {
  ...booking,
  dates: extraSessionDates,
  interpreter: { ...booking.interpreter },
  location: { ...booking.location },
};

describe("TotalInterpretingHours — Booking with an exceeded sessions (dailyInterpretingHours triggered)", () => {

  test("precondition: 39 total date records (16 Booked + 23 Cancelled)", () => {
    expect(extraSessionDates).toHaveLength(39);
    expect(extraSessionDates.filter(d => d.status === "Booked")).toHaveLength(16);
    expect(extraSessionDates.filter(d => d.status === "Cancelled")).toHaveLength(23);
  });

  test("total interpreting hours should be 46.0h under SPKL1", () => {
    const result = getTotalInterpretingHours(bookingWithExtraSessions);
    expect(result.totalHours.SPKL1).toBe(46.0);
  });

  test("dailyInterpretingHours should contain 1 entry (Jan 30)", () => {
    const result = getTotalInterpretingHours(bookingWithExtraSessions);
    expect(result.dailyInterpretingHours).not.toBeNull();
    expect(result.dailyInterpretingHours).toHaveLength(1);

    const dates = result.dailyInterpretingHours!.map((d: any) => d.date).sort();
    expect(dates).toEqual(["2026-01-30"]);
  });

  test("each dailyInterpretingHours entry has correct values", () => {
    const result = getTotalInterpretingHours(bookingWithExtraSessions).dailyInterpretingHours;
    // console.log(result);
    expect(result).toHaveLength(1);
    expect(result![0].totalHours).toBe(8.5);
    expect(result![0].actualHours).toBe(8.42);
    expect(result![0].totalSessions).toBe(1);
    expect(result![0].language).toBe("SPKL1");
    expect(result![0].rate).toBe(40);
    expect(result![0].total).toBe(340);   
  });
});

// ── Booking 1 — Bug reproduction ──────────────
//
// Real production booking: Level 2, Feb 13 – Apr 6, 2025
// Location: Vancouver Law Courts (America/Vancouver)
//
// Bug report: invoice shows 173.5h; correct value is 176h.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exampleBooking = require("./example_booking_1.json");

const FARSI_LANG = {
  id: 270,
  languageId: 23,
  level: 2,
  languageName: "Farsi (Persian)",
  commentOnLevel: null,
};

const booking10020 = {
  ...exampleBooking,
  interpreter: {
    ...exampleBooking.interpreter,
    languageHistory: null,
  },
  dates: exampleBooking.dates.map((d: any) => ({
    ...d,
    cases: d.status === "Booked" ? [{ language: { ...FARSI_LANG } }] : d.cases,
  })),
};

describe("TotalInterpretingHours — Booking 10020 (bug reproduction: 173.5h vs 176h)", () => {

  test("precondition: booked and cancelled sessions count", () => {
    const booked = booking10020.dates.filter((d: any) => d.status === "Booked");
    const cancelled = booking10020.dates.filter((d: any) => d.status === "Cancelled");
    expect(booked.length + cancelled.length).toBe(booking10020.dates.length);
    expect(booked.length).toBeGreaterThan(0);
    expect(cancelled.length).toBeGreaterThan(0);
  });

  test("total interpreting hours should be 176h under SPKL2 (correct value after fix)", () => {
    const result = getTotalInterpretingHours(booking10020);
    // console.log("SPKL2 hours:", result.totalHours.SPKL2);
    expect(result.totalHours.SPKL2).toBe(176);
  });

  test("no other language-type hours should be present", () => {
    const result = getTotalInterpretingHours(booking10020);
    expect(result.totalHours.SPKL1).toBe(0);
    expect(result.totalHours.SPKL3).toBe(0);
    expect(result.totalHours.SPKL4).toBe(0);
    expect(result.totalHours.ASL1).toBe(0);
    expect(result.totalHours.ASL2).toBe(0);
    expect(result.totalHours.CART).toBe(0);
    expect(result.totalHours.OldSPKL2).toBe(0);
  });

  test("dailyInterpretingHours should contain entries for sessions exceeding daily threshold", () => {
    const result = getTotalInterpretingHours(booking10020);
    expect(result.dailyInterpretingHours).not.toBeNull();

    const dates = result.dailyInterpretingHours!.map((d: any) => d.date).sort();
    expect(dates).toEqual([
      "2025-02-13",
      "2025-03-28",
      "2025-03-30",
      "2025-03-31",
      "2025-04-01",
      "2025-04-02",
    ]);
  });
});
