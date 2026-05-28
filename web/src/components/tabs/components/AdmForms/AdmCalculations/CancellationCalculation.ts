import store from "@/store";
import {
  cancellationInfoType,
  totalInterpretingHoursInfoType,
} from "@/types/Bookings/json";
import { holidaysInfoType, rateJsonInfoType } from "@/types/Common";
import moment from "moment-timezone";
import * as _ from "underscore";

// Main entry point: determines which cancelled dates qualify for a cancellation fee,
// calculates total hours and fee based on language rate tiers.
export function cancellationCalculation(booking, gstRate?) {
  //console.log(booking.dates)

  const timezone = booking.location.timezone;
  const dates = booking.dates.map((date) => date.date);
  const sortedDates = _.sortBy(dates);
  const assignmentStart = sortedDates[0];
  // Get unique assignment days (used to determine short-notice threshold)
  const assignmentDays = getAssignmentDays(dates, timezone);

  // Filter cancelled dates that qualify for a cancellation fee
  const cancelledDates = [];
  for (const record of booking.dates) {
    //console.log(record)
    //console.log(record.cancellationDate)
    //console.log(record.date)

    // Skip records that don't qualify:
    // - Not cancelled, no reason given, interpreter-initiated, or explicitly no fee
    if (
      record.status != "Cancelled" ||
      // record.date <= record.cancellationDate ||
      !record.cancellationReason ||
      record.cancellationReason?.includes("Interpreter") ||
      record.cancellationReason?.includes("no cancellation fee")
    )
      continue;

    const daysBetween = getDaysBetweenCancellationAndAssignment(
      assignmentStart,
      record.cancellationDate,
      timezone
    );
    //console.log(daysBetween)
    // Short-notice check: fee applies if cancelled with insufficient business days' notice
    // >10 day assignments: less than 3 business days' notice
    // <=10 day assignments: less than 2 business days' notice
    // Note: cancellations logged AFTER the assignment start also qualify (daysBetween=0)
    if (
      (assignmentDays.length > 10 && daysBetween.length < 3) ||
      (assignmentDays.length <= 10 && daysBetween.length < 2)
    ) {
      cancelledDates.push(record);
    }
  }

  //console.log(cancelledDates)
  if (cancelledDates.length > 0) {
    const totalHours = getTotalHours(booking, cancelledDates, timezone);
    const totalCancellationFee = getTotalCancellations(
      totalHours,
      booking,
      gstRate
    );
    //console.log(totalCancellationFee)
    //====
    return {
      totalHours: totalCancellationFee.totalHours,
      bestRate: totalCancellationFee.bestRate,
      subtotalFees: totalCancellationFee.subtotal,
      totalFees: totalCancellationFee.total,
      totalGst: totalCancellationFee.gst,
    } as cancellationInfoType;
  } else {
    return {
      bestRate: 0,
      totalHours: 0,
      subtotalFees: 0,
      totalFees: 0,
      totalGst: 0,
    } as cancellationInfoType;
  }
}

//______________________________________
//______________________________________
//______________________________________

// Calculates the cancellation fee from the accumulated hours per language type.
// Finds the best (highest) rate among cancelled languages, applies tiered hour caps,
// and computes subtotal + GST.
function getTotalCancellations(
  totalHours: totalInterpretingHoursInfoType,
  booking,
  gstRate
) {
  // Sum all cancelled hours and collect which language types had cancellations
  let totalCancelledHr = 0;
  const cancelledLaguagesType = []; // e.g. ["CART"], ["SPKL2"] — without "Old" prefix
  const cancelledLaguagesName = []; // e.g. ["OldCART"], ["SPKL2"] — with "Old" prefix if applicable
  for (const langItemHoursKey of Object.keys(totalHours)) {
    if (totalHours[langItemHoursKey] > 0) {
      const langkey = langItemHoursKey.replace("Old", "");
      cancelledLaguagesType.push(langkey);
      cancelledLaguagesName.push(langItemHoursKey);
      totalCancelledHr += totalHours[langItemHoursKey];
    }
  }
  // Sort rates highest-to-lowest to find the best (most expensive) rate
  const rates: rateJsonInfoType[] = store.state.Common.rates;
  const sortedRates = _.chain(rates)
    .sortBy("name")
    .reverse()
    .sortBy("value")
    .reverse()
    .value();
  // Find the first (highest-value) rate that matches a cancelled language type
  const bestRateIndex = sortedRates.findIndex((rate) =>
    cancelledLaguagesType.includes(rate.name)
  );
  // Use current rate value, or previousValue if the cancellation predates the rate change
  const bestRate = cancelledLaguagesName.includes(
    sortedRates[bestRateIndex].name
  )
    ? sortedRates[bestRateIndex].value
    : sortedRates[bestRateIndex].previousValue;
  //console.log(totalCancelledHr)
  //console.log(cancelledLaguagesName)
  //console.log(sortedRates)
  //console.log(bestRateIndex)
  //console.log(bestRate)

  const isCart = cancelledLaguagesType.includes("CART");
  // Tier thresholds: each day = 5 hours (morning 2.5h + afternoon 2.5h)
  const halfday = 2.5;   // 1 half-day slot
  const twodays = 2 * 5;     // 10h
  const fivedays = 5 * 5;    // 25h
  const tendays = 10 * 5;    // 50h
  const fifteendays = 15 * 5; // 75h

  // Apply tiered hour caps based on total cancelled hours.
  // CART has different rules for small cancellations (½ day → 3h, up to 2 days → 5.5h).
  // Non-CART: up to 2 days uses actual hours; above that, both use the same caps.
  let cancellationFee = 0;
  let totalCancelledHrMax = 0;
  if (isCart && totalCancelledHr <= halfday) totalCancelledHrMax = 3;        // CART ½ day: 3h paid
  else if (isCart && totalCancelledHr < twodays) totalCancelledHrMax = 5.5;  // CART up to (but not including) 2 full days: 5.5h paid
  else if (totalCancelledHr <= twodays) totalCancelledHrMax = totalCancelledHr; // Non-CART up to 2 days: actual hours
  else if (totalCancelledHr > twodays && totalCancelledHr <= fivedays)
    totalCancelledHrMax = 10;   // 2-5 days: 10h
  else if (totalCancelledHr > fivedays && totalCancelledHr <= tendays)
    totalCancelledHrMax = 15;   // 6-10 days: 15h
  else if (totalCancelledHr > tendays && totalCancelledHr <= fifteendays)
    totalCancelledHrMax = 20;   // 11-15 days: 20h
  else if (totalCancelledHr > fifteendays) totalCancelledHrMax = 25; // 16+ days: 25h

  //The + 0.0001 is typically added as a small floating-point correction to avoid JavaScript precision issues during currency calculations
  cancellationFee = Number((totalCancelledHrMax * Number(bestRate) + 0.0001));

  const gstNumber = booking?.interpreter?.gst;
  if (!gstRate)
    gstRate = booking?.admDetail?.calculations?.gst?.gstRate
      ? booking.admDetail.calculations.gst.gstRate
      : "0.05";

  const cancellationSubtotal = Number(cancellationFee.toFixed(2));
  if (gstNumber)
    return {
      bestRate: bestRate,
      totalHours: totalCancelledHrMax,
      subtotal: cancellationSubtotal,
      total: Number(
        (
          cancellationSubtotal * Number(gstRate) +
          cancellationSubtotal +
          0.0001
        ).toFixed(2)
      ),
      gst: Number((cancellationSubtotal * Number(gstRate) + 0.0001).toFixed(2)),
    };
  else
    return {
      bestRate: bestRate,
      totalHours: totalCancelledHrMax,
      subtotal: cancellationSubtotal,
      total: cancellationSubtotal,
      gst: 0,
    };
}

// Accumulates cancellation hours per language type (e.g. SPKL2, OldCART).
// Each cancelled date is split into morning (before 1 PM) and afternoon (1 PM onward).
// Each half-day slot is always counted as exactly 2.5 hours (the half-day minimum).
// The highest-rate language per half-day determines which bucket the hours go into.
function getTotalHours(booking, cancelledDates, timezone) {
  const rates: rateJsonInfoType[] = store.state.Common.rates;

  const totalHours: totalInterpretingHoursInfoType = {
    SPKL1: 0,
    OldSPKL1: 0,
    SPKL2: 0,
    OldSPKL2: 0,
    SPKL3: 0,
    OldSPKL3: 0,
    SPKL4: 0,
    OldSPKL4: 0,
    ASL1: 0,
    OldASL1: 0,
    ASL2: 0,
    OldASL2: 0,
    CART: 0,
    OldCART: 0,
  };

  const MAX_INX = 1000;

  const sortedRateNames = _.chain(rates)
    .sortBy("name")
    .reverse()
    .sortBy("value")
    .reverse()
    .value()
    .map((rate) => {
      return rate.name;
    });

  const languageHistory = _.sortBy(
    booking.interpreter.languageHistory,
    "effective_date"
  ).reverse();
  const languageHistoryRev = _.sortBy(
    booking.interpreter.languageHistory,
    "effective_date"
  );
  //console.log(sortedRateNames)
  //console.log(sortedRateNames.length-1)
  //console.log(languageHistory)

  // Accumulate raw session hours and track the highest-rate language per half-day per date
  const sessionHours = {};
  const recordDateTemplate = {
    Morning: 0,        // Raw morning hours for this date
    Afternoon: 0,      // Raw afternoon hours for this date
    minLevelMorning: MAX_INX,   // Best (lowest index = highest rate) language for morning
    minLevelAfternoon: MAX_INX, // Best (lowest index = highest rate) language for afternoon
  };

  for (const record of cancelledDates) {
    if (record.status != "Cancelled") continue;
    const recordDate = moment(record.date).tz(timezone).format("YYYY-MM-DD");
    const start = moment(record.startTime, "hh:mm A");
    const end = moment(record.finishTime, "hh:mm A");
    const mid = moment("01:00 PM", "hh:mm A");
    //console.error(recordDate+' '+ record.startTime)
    ////console.log(mid.format())
    ////console.log(end<=mid)
    ////console.log(start>=mid)
    ////console.log(start<mid && end>mid)
    ////console.log(end.format())

    //console.log(record)

    // Determine language type/level for each case, considering historical level changes
    const dateLanguagesType: number[] = [];
    for (const cancelCase of record.cases) {
      const langItem = cancelCase.language;
      let languageLevel = langItem.level;
      ////console.log(langItem.languageName)

      const indexLanguageHistory = languageHistory.findIndex(
        (lang) =>
          recordDate > lang.effective_date &&
          langItem.languageName.toLowerCase() == lang.language.toLowerCase()
      );
      //console.warn(indexLanguageHistory)

      const indexLanguageHistoryRev = languageHistoryRev.findIndex(
        (lang) =>
          recordDate < lang.effective_date &&
          langItem.languageName.toLowerCase() == lang.language.toLowerCase()
      );
      //console.warn(indexLanguageHistoryRev)
      ////console.log(languageHistoryRev[indexLanguageHistoryRev])

      if (indexLanguageHistory >= 0) {
        languageLevel = languageHistory[indexLanguageHistory].level;
      } else if (indexLanguageHistoryRev >= 0) {
        languageLevel = languageHistoryRev[indexLanguageHistoryRev].prvlevel
          ? languageHistoryRev[indexLanguageHistoryRev].prvlevel
          : languageHistoryRev[indexLanguageHistoryRev].level;
      }

      // Classify language: CART (no level), ASL+level, or SPKL+level
      let languageType = "";
      if (langItem.languageName.includes("CART")) languageType = "CART";
      else if (langItem.languageName.includes("ASL"))
        languageType = "ASL" + languageLevel;
      else languageType = "SPKL" + languageLevel;
      // Store the index in the sorted (highest-to-lowest rate) list
      dateLanguagesType.push(sortedRateNames.indexOf(languageType));
    }
    // Lowest index = highest rate language for this record
    const highestLanguageIndex = Math.min(...dateLanguagesType);
    //console.log(highestLanguageIndex)

    if (!sessionHours[recordDate]) {
      sessionHours[recordDate] = JSON.parse(JSON.stringify(recordDateTemplate));
    }

    // //console.log(start.format())
    // //console.log(end.format())
    // //console.log(sessionDuration(start, end))
    // Split session into morning/afternoon based on 1 PM boundary
    if (end <= mid) {
      // Entire session is in the morning slot
      sessionHours[recordDate].Morning += sessionDuration(start, end);
      sessionHours[recordDate].minLevelMorning = Math.min(
        sessionHours[recordDate].minLevelMorning,
        highestLanguageIndex
      );
    } else if (start >= mid) {
      // Entire session is in the afternoon slot
      sessionHours[recordDate].Afternoon += sessionDuration(start, end);
      sessionHours[recordDate].minLevelAfternoon = Math.min(
        sessionHours[recordDate].minLevelAfternoon,
        highestLanguageIndex
      );
    } else if (start < mid && end > mid) {
      // Session spans both slots — split at 1 PM
      sessionHours[recordDate].Morning += sessionDuration(start, mid);
      sessionHours[recordDate].Afternoon += sessionDuration(mid, end);
      sessionHours[recordDate].minLevelMorning = Math.min(
        sessionHours[recordDate].minLevelMorning,
        highestLanguageIndex
      );
      sessionHours[recordDate].minLevelAfternoon = Math.min(
        sessionHours[recordDate].minLevelAfternoon,
        highestLanguageIndex
      );
    }
  }

  //console.log(sessionHours)

  // Convert raw session hours into language-bucketed totals.
  // Each half-day with any hours is counted as exactly 2.5h (half-day minimum/cap).
  for (const recordDate of Object.keys(sessionHours)) {
    // //console.log(recordDate)
    if (
      sessionHours[recordDate].Morning > 0 &&
      sessionHours[recordDate].minLevelMorning < MAX_INX
    ) {
      const keyMorning = getTotalHoursKey(
        recordDate,
        rates,
        sortedRateNames,
        sessionHours[recordDate].minLevelMorning
      );

      // Handle validation errors from getTotalHoursKey
      if (!keyMorning) {
        console.error(
          "Skipping morning cancellation hours calculation due to invalid rate key for date:",
          recordDate
        );
        continue; // Skip this recordDate entirely
      }

      // Always 2.5h — min(2.5, max(2.5, x)) clamps any value to exactly 2.5
      const morningHours = Math.min(2.5,Math.max(2.5, sessionHours[recordDate].Morning));
      totalHours[keyMorning] = totalHours[keyMorning] + morningHours;
    }
    if (
      sessionHours[recordDate].Afternoon > 0 &&
      sessionHours[recordDate].minLevelAfternoon < MAX_INX
    ) {
      const keyAfternoon = getTotalHoursKey(
        recordDate,
        rates,
        sortedRateNames,
        sessionHours[recordDate].minLevelAfternoon
      );

      // Handle validation errors from getTotalHoursKey
      if (!keyAfternoon) {
        console.error(
          "Skipping afternoon cancellation hours calculation due to invalid rate key for date:",
          recordDate
        );
        continue; // Skip this recordDate entirely
      }

      // Always 2.5h — same half-day clamp as morning
      const afternoonHours = Math.min(2.5,Math.max(2.5, sessionHours[recordDate].Afternoon));
      totalHours[keyAfternoon] = totalHours[keyAfternoon] + afternoonHours;
    }

    ////console.log(dateLanguagesType)
    // //console.log(highestLanguageIndex)
    // //console.log(higherRateLanguage)
    ////console.log(record.date.slice(0,10))
    ////console.log(higherRateLanguage.valueChangedDate.slice(0,10))
  }
  //console.log(totalHours)
  return totalHours;
}

// Returns unique assignment dates (used to count total assignment days for notice threshold)
function getAssignmentDays(dates, timezone) {
  const assignmentDays = [];
  for (const day of dates) {
    const dayTZ = moment(day).tz(timezone).format("YYYY-MM-DD");
    if (!assignmentDays.includes(dayTZ)) assignmentDays.push(dayTZ);
  }
  //console.log(assignmentDays)
  return assignmentDays;
}

// Counts business days (excluding weekends and holidays) between the cancellation date
// and the assignment start date. Returns an array of those business days.
// If cancellation is on or after the start date, returns empty array (0 business days).
function getDaysBetweenCancellationAndAssignment(
  assignmentStart,
  cancelDate,
  timezone
) {
  const daysBetweenCancellationAndAssignment = [];
  const holidayList = getHolidays();

  const assignmentStartDateObj = moment(assignmentStart).tz(timezone); //('2022-04-20T09:30:00.000-08:00') //moment(dates[0])//this.combineDataTime(this.cancellationBooking.date, this.cancellationBooking.startTime)
  const cancellationDateObj = moment(cancelDate).tz(timezone); //('2022-04-14T10:00:00.000-08:00')

  const assignmentStartDate = assignmentStartDateObj.format("YYYY-MM-DD");
  const daysDiff = assignmentStartDateObj.diff(cancellationDateObj, "days") + 1;

  for (let day = 1; day <= daysDiff; day++) {
    const nextdayObj = cancellationDateObj.clone().add(day, "day");
    const nextDay = nextdayObj.format("YYYY-MM-DD");
    const weekDayName = nextdayObj.format("dd");
    if (nextDay >= assignmentStartDate) break;
    //console.log(weekDayName)
    //console.log(nextDay)
    if (
      weekDayName == "Sa" ||
      weekDayName == "Su" ||
      holidayList.includes(nextDay)
    )
      continue;
    daysBetweenCancellationAndAssignment.push(nextDay);
  }
  // console.warn(cancellationDateObj.format())
  //console.log(assignmentStartDate)
  //console.log(daysBetweenCancellationAndAssignment)
  return daysBetweenCancellationAndAssignment;
}

//______________________________________
//______________________________________
//______________________________________
function getHolidays() {
  const holidays: holidaysInfoType[] = store.state.Common.holidays;
  const holidayList = [];
  for (const year of holidays) {
    for (const value of Object.values(year)) holidayList.push(value);
  }
  return holidayList;
}

function sessionDuration(start, end) {
  const diff = moment.duration(end.diff(start)).asMinutes();
  const totalHour = Number((diff / 60).toFixed(2));
  return totalHour;
}

// Determines the totalHours bucket key for a given date and language rate.
// Returns the language type name (e.g. "SPKL2") or prefixed with "Old" if the
// cancellation date predates a rate change (to use the previous rate value).
function getTotalHoursKey(
  recordDate,
  rates,
  sortedRateNames,
  highestLanguageIndex
) {
  // Input validation
  if (!recordDate || typeof recordDate !== "string") {
    console.error(
      "Invalid recordDate provided to getTotalHoursKey:",
      recordDate
    );
    return null;
  }
  // Validate recordDate format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(recordDate)) {
    console.error(
      "Invalid recordDate format (expected YYYY-MM-DD):",
      recordDate
    );
    return null;
  }

  // Validate rates array
  if (!rates || !Array.isArray(rates) || rates.length === 0) {
    console.error("Invalid or empty rates array in getTotalHoursKey");
    return null;
  }
  // Validate sortedRateNames array
  if (
    !sortedRateNames ||
    !Array.isArray(sortedRateNames) ||
    sortedRateNames.length === 0
  ) {
    console.error("Invalid or empty sortedRateNames array in getTotalHoursKey");
    return null;
  }

  // Validate highestLanguageIndex
  if (
    typeof highestLanguageIndex !== "number" ||
    highestLanguageIndex < 0 ||
    highestLanguageIndex >= sortedRateNames.length
  ) {
    console.error(
      "Invalid highestLanguageIndex in getTotalHoursKey:",
      highestLanguageIndex,
      "sortedRateNames length:",
      sortedRateNames.length
    );
    return null;
  }

  const higherRateLanguageName = sortedRateNames[highestLanguageIndex];
  if (!higherRateLanguageName) {
    console.error("Could not find rate name at index:", highestLanguageIndex);
    return null;
  }

  const higherRateLanguage = rates.filter(
    (rate) => rate.name == higherRateLanguageName
  )[0];
  if (!higherRateLanguage) {
    console.error(
      "Could not find rate object for name:",
      higherRateLanguageName
    );
    return null;
  }

  let key = higherRateLanguageName;

  // Safe date conversion and comparison
  try {
    if (higherRateLanguage.valueChangedDate) {
      const higherRateDate = moment(higherRateLanguage.valueChangedDate)
        .tz("America/Vancouver")
        .format("YYYY-MM-DD");

      if (!dateRegex.test(higherRateDate)) {
        console.error(
          "Invalid valueChangedDate format after formatting:",
          higherRateDate
        );
        return null;
      }

      const recordMoment = moment(recordDate, "YYYY-MM-DD", true);
      const rateMoment = moment(higherRateDate, "YYYY-MM-DD", true);

      if (!recordMoment.isValid() || !rateMoment.isValid()) {
        console.error("Invalid date(s) for comparison:", {
          recordDate,
          higherRateDate,
        });
        return null;
      }

      if (
        higherRateLanguage.previousValue != higherRateLanguage.value &&
        recordMoment.isBefore(rateMoment)
      ) {
        key = "Old" + higherRateLanguageName;
      }
    }
  } catch (error) {
    console.error("Error processing dates in getTotalHoursKey:", error);
    return null;
  }

  return key;
}
