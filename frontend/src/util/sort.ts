import { Interpreter, Language } from 'constants/interfaces'

const fieldSort = (field: string) =>
  (a: any, b: any): number =>
    a[field] === b[field]
      ? 0
      : a[field] > b[field] ? 1 : -1

const arrayFieldSort = (field: string, index: number, subField: string) =>
  (a: any, b: any): number =>
    a[field][index][subField] === b[field][index][subField]
      ? 0
      : a[field][index][subField] > b[field][index][subField] ? 1 : -1

const languageArraySort = (language: string, subField: string = 'level') => {
  return (a: any, b: any): number => {
    const aI = a.languages.map((f: Language) => f.languageName).indexOf(language)
    const bI = b.languages.map((f: Language) => f.languageName).indexOf(language)
    return a.languages[aI][subField] === b.languages[bI][subField]
      ? 0
      : a.languages[aI][subField] > b.languages[bI][subField] ? 1 : -1
  }
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
  languageArraySort,
  levelSort,
}
