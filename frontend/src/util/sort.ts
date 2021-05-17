import { Interpreter, Language, Booking, BookingDate } from 'constants/interfaces'
import { format, getUnixTime } from 'date-fns';

const fieldSort = (field: string) =>
  (a: any, b: any): number =>
    a[field] === b[field]
      ? 0
      : a[field] > b[field] ? 1 : -1

const objectFieldSort = (field: string, key: string) => 
  (a: any, b: any): number =>
    a[field][key] === b[field][key]
      ? 0
      : a[field][key] > b[field][key] ? 1 : -1

const arrayFieldSort = (field: string, index: number, subField: string) =>
  (a: any, b: any): number =>
    a[field][index][subField] === b[field][index][subField]
      ? 0
      : a[field][index][subField] > b[field][index][subField] ? 1 : -1

const languageArraySort = (language: string, subField: string = 'level') => {
  return (a: any, b: any): number => {
    const aLanguages = a.languages.map((f: Language) => f.languageName)
    const bLanguages = b.languages.map((f: Language) => f.languageName)
    let aI = aLanguages.indexOf(language)
    let bI = bLanguages.indexOf(language)
    if (aI === -1) {
      const match = aLanguages.find((al: string) => al.includes(language))
      aI = aLanguages.indexOf(match)
    }
    if (bI === -1) {
      const match = bLanguages.find((bl: string) => bl.includes(language))
      bI = bLanguages.indexOf(match)
    }
    return a.languages[aI === -1 ? 0 : aI][subField] === b.languages[bI === -1 ? 0 : bI][subField]
      ? 0
      : a.languages[aI === -1 ? 0 : aI][subField] > b.languages[bI === -1 ? 0 : bI][subField] ? 1 : -1
  }
}

const bookingDateSort = (a: any, b: any) => {
  // compares first date in array
  const aDate = getUnixTime(new Date(a.dates[0].date));
  const bDate = getUnixTime(new Date(b.dates[0].date));
  if (aDate === bDate) return 0;
  return aDate > bDate ? 1 : -1;
}

const levelSort = (interpreters: Interpreter[], language: string) => {
  const mapped = interpreters.map(
    (interpreter: Interpreter, index: number) => ({
      // if this language cannot be found for some reason, set it to low
      index,
      levelForLanguage: interpreter.languages.find((l: Language )=> l.languageName.includes(language) || l.languageName === language)?.level || 5
    }))
    .sort((a, b) => a.levelForLanguage - b.levelForLanguage)
  return mapped.map(el => interpreters[el.index])
}

export {
  fieldSort,
  arrayFieldSort,
  objectFieldSort,
  bookingDateSort,
  languageArraySort,
  levelSort,
}
