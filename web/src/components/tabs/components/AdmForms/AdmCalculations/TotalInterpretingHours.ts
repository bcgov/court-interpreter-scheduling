import store from "@/store";
import {
  dailyInterpretingHoursInfoType,
  totalInterpretingHoursInfoType,
} from "@/types/Bookings/json";
import { rateJsonInfoType } from "@/types/Common";
import moment from "moment-timezone";
import * as _ from "underscore";

// // "[{\"language_id\": 5, \"language\": \"ASL\", \"level\": 2, \"effective_date\": \"2022-08-08\", \"disabled\": false},{\"language_id\": 5, \"language\": \"ASL\", \"level\": 1, \"effective_date\": \"2022-01-08\", \"disabled\": false}]"
// "[{\"language_id\": 4, \"language\": \"Arabic\", \"level\": 2, \"prvlevel\": 3, \"effective_date\": \"2022-11-03\", \"disabled\": false}]"
// "[{\"language_id\": 4, \"language\": \"Arabic\", \"level\": 2, \"effective_date\": \"2022-11-03\", \"disabled\": false}]"
// "[{\"language_id\": 4, \"language\": \"Arabic\", \"level\": 2, \"effective_date\": \"2022-11-03\", \"disabled\": false}, {\"language_id\": 4, \"language\": \"Arabic\", \"level\": 1, \"prvlevel\": 2, \"effective_date\": \"2022-11-04\", \"disabled\": false}]"

// "[{\"language_id\": 4, \"language\": \"Arabic\", \"level\": 2, \"prvlevel\": 3, \"effective_date\": \"2022-11-13\", \"disabled\": false}, {\"language_id\": 4, \"language\": \"Arabic\", \"level\": 1, \"prvlevel\": 2, \"effective_date\": \"2022-11-17\", \"disabled\": false}, {\"language_id\": 4, \"language\": \"Arabic\", \"level\": 3, \"prvlevel\": 4, \"effective_date\": \"2022-11-04\", \"disabled\": false}]"

export function getTotalInterpretingHours(booking) {
  //console.log(booking)
  const rates: rateJsonInfoType[] = store.state.Common.rates;

  // Initialize empty totalHours with proper type structure
  const emptyTotalHours: totalInterpretingHoursInfoType = {
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

  // Early validation of critical inputs
  if (!booking?.dates || !Array.isArray(booking.dates)) {
    console.error(
      "getTotalInterpretingHours: Invalid or missing booking.dates"
    );
    return { totalHours: emptyTotalHours, dailyInterpretingHours: null };
  }

  if (!rates || !Array.isArray(rates) || rates.length === 0) {
    console.error("getTotalInterpretingHours: Invalid or missing rates data");
    return { totalHours: emptyTotalHours, dailyInterpretingHours: null };
  }

  // Validate rates data integrity
  const invalidRates = rates.filter(
    (rate) =>
      !rate.name ||
      typeof rate.value !== "number" ||
      typeof rate.previousValue !== "number"
  );

  if (invalidRates.length > 0) {
    console.error(
      "getTotalInterpretingHours: Found invalid rate objects:",
      invalidRates
    );
    // Continue processing but with warning
  }

  const totalHours: totalInterpretingHoursInfoType = { ...emptyTotalHours };

  const dailyInterpretingHours: dailyInterpretingHoursInfoType[] = [];

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

  // Validate sortedRateNames
  if (!sortedRateNames || sortedRateNames.length === 0) {
    console.error(
      "getTotalInterpretingHours: Failed to generate sortedRateNames"
    );
    return { totalHours: emptyTotalHours, dailyInterpretingHours: null };
  }

  // Filter out any null/undefined rate names
  const validRateNames = sortedRateNames.filter(
    (name) => name && typeof name === "string"
  );
  if (validRateNames.length !== sortedRateNames.length) {
    console.warn(
      "getTotalInterpretingHours: Filtered out invalid rate names:",
      sortedRateNames.length - validRateNames.length
    );
  }

  const languageHistory = _.sortBy(
    booking.interpreter.languageHistory,
    "effective_date"
  ).reverse();
  const languageHistoryRev = _.sortBy(
    booking.interpreter.languageHistory,
    "effective_date"
  );
  // console.log(sortedRateNames)
  //console.log(sortedRateNames.length-1)
  //console.log(languageHistory)

  const sessionHours = {};
  const recordDateTemplate = {
    Morning: 0,
    Afternoon: 0,
    dayTotalHours: 0,
    totalSessions: 0,
    minLevelMorning: MAX_INX,
    minLevelAfternoon: MAX_INX,
  };

  for (const record of booking.dates) {
    if (record.status != "Booked") continue;

    // Validate input data before processing
    if (!record.date) {
      console.error("Skipping record with missing date:", record);
      continue;
    }

    if (!booking.location?.timezone) {
      console.error(
        "Skipping record due to missing timezone:",
        booking.location
      );
      continue;
    }

    // Safe recordDate generation with validation
    let recordDate;
    try {
      const dateMoment = moment(record.date);
      if (!dateMoment.isValid()) {
        console.error("Skipping record with invalid date:", record.date);
        continue;
      }

      const tzMoment = dateMoment.tz(booking.location.timezone);
      if (!tzMoment.isValid()) {
        console.error(
          "Skipping record due to timezone conversion error:",
          booking.location.timezone
        );
        continue;
      }

      recordDate = tzMoment.format("YYYY-MM-DD");

      // Final validation of generated recordDate
      if (
        !recordDate ||
        recordDate === "Invalid date" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(recordDate)
      ) {
        console.error(
          "Skipping record due to invalid generated recordDate:",
          recordDate
        );
        continue;
      }
    } catch (error) {
      console.error("Error generating recordDate for record:", record, error);
      continue;
    }
    const start = moment(record.actualStartTime, "hh:mm A");
    const end = moment(record.actualFinishTime, "hh:mm A");
    const mid = moment("01:00 PM", "hh:mm A");
    //console.error(recordDate+' '+ record.actualStartTime)
    //console.log(mid.format())
    //console.log(end<=mid)
    //console.log(start>=mid)
    //console.log(start<mid && end>mid)
    //console.log(end.format())

    //console.log(record)

    const dateLanguagesType: number[] = [];
    for (const bookingCase of record.cases) {
      const langItem = bookingCase.language;
      let languageLevel = langItem.level;
      //console.log(langItem.languageName)

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
      //console.log(languageHistoryRev[indexLanguageHistoryRev])

      if (indexLanguageHistory >= 0) {
        languageLevel = languageHistory[indexLanguageHistory].level;
      } else if (indexLanguageHistoryRev >= 0) {
        languageLevel = languageHistoryRev[indexLanguageHistoryRev].prvlevel
          ? languageHistoryRev[indexLanguageHistoryRev].prvlevel
          : languageHistoryRev[indexLanguageHistoryRev].level;
      }

      let languageType = "";
      if (langItem.languageName.includes("CART")) languageType = "CART";
      else if (langItem.languageName.includes("ASL"))
        languageType = "ASL" + languageLevel;
      else languageType = "SPKL" + languageLevel;
      dateLanguagesType.push(validRateNames.indexOf(languageType));
    }
    const highestLanguageIndex = Math.min(...dateLanguagesType);
    //console.log(highestLanguageIndex)

    if (!sessionHours[recordDate]) {
      sessionHours[recordDate] = JSON.parse(JSON.stringify(recordDateTemplate));
    }

    // console.log(start.format())
    // console.log(end.format())
    // console.log(sessionDuration(start, end))
    // if(end<=mid){ //'Morning'
    const sessionDurationHours = sessionDuration(start, end);
    const sessionMinHours = Math.max(2.5, sessionDurationHours);
    // console.log(sessionMinHours)
    // console.log(Math.ceil(sessionMinHours*2)/2)
    sessionHours[recordDate].Morning += Math.ceil(sessionMinHours * 2) / 2;
    sessionHours[recordDate].minLevelMorning = Math.min(
      sessionHours[recordDate].minLevelMorning,
      highestLanguageIndex
    );
    if (!sessionHours[recordDate]?.dayTotalHours)
      sessionHours[recordDate].dayTotalHours = 0;
    sessionHours[recordDate].dayTotalHours += sessionDurationHours;
    if (!sessionHours[recordDate].totalSessions)
      sessionHours[recordDate].totalSessions = 0;
    sessionHours[recordDate].totalSessions += 1;
    // }else if(start>=mid){ //'Afternoon'
    //     sessionHours[recordDate].Afternoon += sessionDuration(start, end)
    //     sessionHours[recordDate].minLevelAfternoon = Math.min(sessionHours[recordDate].minLevelAfternoon, highestLanguageIndex)
    // }else if(start<mid && end>mid){ //'FullDay'
    //     sessionHours[recordDate].Morning += sessionDuration(start, mid)
    //     sessionHours[recordDate].Afternoon += sessionDuration(mid, end)
    //     sessionHours[recordDate].minLevelMorning   = Math.min(sessionHours[recordDate].minLevelMorning,   highestLanguageIndex)
    //     sessionHours[recordDate].minLevelAfternoon = Math.min(sessionHours[recordDate].minLevelAfternoon, highestLanguageIndex)
    // }
  }

  // console.log(sessionHours)

  for (const recordDate of Object.keys(sessionHours)) {
    // console.log(recordDate)
    if (
      sessionHours[recordDate].Morning > 0 &&
      sessionHours[recordDate].minLevelMorning < MAX_INX
    ) {
      const keyMorning = getTotalHoursKey(
        recordDate,
        rates,
        validRateNames,
        sessionHours[recordDate].minLevelMorning
      );

      // Handle validation errors from getTotalHoursKey
      if (!keyMorning) {
        console.error(
          "Skipping morning hours calculation due to invalid rate key for date:",
          recordDate
        );
        continue; // Skip this recordDate entirely
      }

      const morningHours = Math.max(2.5, sessionHours[recordDate].Morning);
      totalHours[keyMorning] =
        totalHours[keyMorning] + Math.ceil(morningHours * 2) / 2;
      if (morningHours > Math.max(5, sessionHours[recordDate].dayTotalHours)) {
        const langRate = rates.find((rate) => keyMorning?.includes(rate.name));
        const rate = keyMorning?.includes("Old")
          ? langRate?.previousValue
          : langRate?.value;
        dailyInterpretingHours.push({
          date: recordDate,
          totalHours: sessionHours[recordDate].Morning,
          actualHours: Number(
            sessionHours[recordDate].dayTotalHours.toFixed(2)
          ),
          totalSessions: sessionHours[recordDate].totalSessions,
          language: keyMorning,
          rate: rate,
          total: Number(
            (Number(rate) * sessionHours[recordDate].Morning).toFixed(2)
          ),
        });
      }
    }
    if (
      sessionHours[recordDate].Afternoon > 0 &&
      sessionHours[recordDate].minLevelAfternoon < MAX_INX
    ) {
      const keyAfternoon = getTotalHoursKey(
        recordDate,
        rates,
        validRateNames,
        sessionHours[recordDate].minLevelAfternoon
      );

      // Handle validation errors from getTotalHoursKey
      if (!keyAfternoon) {
        console.error(
          "Skipping afternoon hours calculation due to invalid rate key for date:",
          recordDate
        );
        continue; // Skip this recordDate entirely
      }

      const afternoonHours = Math.max(2.5, sessionHours[recordDate].Afternoon);
      totalHours[keyAfternoon] =
        totalHours[keyAfternoon] + Math.ceil(afternoonHours * 2) / 2;
    }

    //console.log(dateLanguagesType)
    // console.log(highestLanguageIndex)
    // console.log(higherRateLanguage)
    //console.log(record.date.slice(0,10))
    //console.log(higherRateLanguage.valueChangedDate.slice(0,10))
  }
  // console.log(totalHours)
  return {
    totalHours,
    dailyInterpretingHours:
      dailyInterpretingHours.length > 0 ? dailyInterpretingHours : null,
  };
}

function sessionDuration(start, end) {
  const diff = moment.duration(end.diff(start)).asMinutes();
  const totalHour = Number((diff / 60).toFixed(2));
  return totalHour;
}

function getTotalHoursKey(
  recordDate,
  rates,
  sortedRateNames,
  highestLanguageIndex
) {
  if (!recordDate || typeof recordDate !== "string") {
    console.error("getTotalHoursKey: Invalid recordDate:", recordDate);
    return null; 
  }

  // Validate recordDate format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(recordDate) || recordDate === "Invalid date") {
    console.error("getTotalHoursKey: Invalid recordDate format:", recordDate);
    return null; 
  }
  if (
    !sortedRateNames ||
    highestLanguageIndex < 0 ||
    highestLanguageIndex >= sortedRateNames.length
  ) {
    console.error(
      "getTotalHoursKey: Invalid highestLanguageIndex:",
      highestLanguageIndex,
      "for array length:",
      sortedRateNames?.length
    );
    return null; 
  }

  const higherRateLanguageName = sortedRateNames[highestLanguageIndex];
  if (!higherRateLanguageName) {
    console.error(
      "getTotalHoursKey: No rate name found at index:",
      highestLanguageIndex
    );
    return null; 
  }

  const higherRateLanguage = rates.filter(
    (rate) => rate.name == higherRateLanguageName
  )[0];

  if (!higherRateLanguage) {
    console.error(
      "getTotalHoursKey: Rate not found for:",
      higherRateLanguageName
    );
    return null; 
  }

  if (
    typeof higherRateLanguage.value !== "number" ||
    typeof higherRateLanguage.previousValue !== "number"
  ) {
    console.error("getTotalHoursKey: Invalid rate values:", higherRateLanguage);
    return null; 
  }

  let key = higherRateLanguageName;

  try {
    if (!higherRateLanguage.valueChangedDate) {
      console.warn(
        "getTotalHoursKey: Missing valueChangedDate for rate:",
        higherRateLanguageName
      );
      // If no change date, assume current rate is correct
      return key;
    }

    const rateDateMoment = moment(higherRateLanguage.valueChangedDate);
    if (!rateDateMoment.isValid()) {
      console.error(
        "getTotalHoursKey: Invalid valueChangedDate:",
        higherRateLanguage.valueChangedDate
      );
      // If can't parse change date
      return null;
    }

    const higherRateDate = rateDateMoment
      .tz("America/Vancouver")
      .format("YYYY-MM-DD");

    // Validate converted date
    if (!dateRegex.test(higherRateDate) || higherRateDate === "Invalid date") {
      console.error(
        "getTotalHoursKey: Invalid converted higherRateDate:",
        higherRateDate
      );
      return null;
    }
    const ratesAreDifferent =
      higherRateLanguage.previousValue !== higherRateLanguage.value;

    if (ratesAreDifferent) {
      const recordDateMoment = moment(recordDate, "YYYY-MM-DD", true); // strict parsing
      const rateDateCompareMoment = moment(higherRateDate, "YYYY-MM-DD", true);

      if (!recordDateMoment.isValid()) {
        console.error(
          "getTotalHoursKey: Cannot parse recordDate for comparison:",
          recordDate
        );
        return null;
      }
      if (recordDateMoment.isBefore(rateDateCompareMoment)) {
        key = "Old" + higherRateLanguageName;
      }
    }
  } catch (error) {
    console.error("getTotalHoursKey: Error in date processing:", error);
    // If any error in date processing, return null
    return null;
  }

  return key;
}
