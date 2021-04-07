import { LanguageBase } from './interfaces';

export const languages = [
<<<<<<< HEAD
  'Afghani-Dari',
=======
>>>>>>> [web][api]
  'Albanian',
  'Amharic',
  'Arabic',
  'ASL',
<<<<<<< HEAD
  'Azerbaijan-Turkish',
  'Azerbaijani',
=======
>>>>>>> [web][api]
  'Bengali',
  'Bosnian',
  'Bulgarian',
  'Burmese',
  'Cambodian (Khmer)',
  'Cantonese',
  'CART',
  'Cebuano',
<<<<<<< HEAD
  'Chiu Chow (Swatow)',
=======
  'Chiu chow (Swatow)',
>>>>>>> [web][api]
  'Croatian',
  'Czech',
  'Dari',
  'Dinka',
  'Dutch',
  'Farsi',
<<<<<<< HEAD
  'Farsi-Persian',
  'Fiji-Hindi',
=======
  'Farsi-persian',
>>>>>>> [web][api]
  'Filipino',
  'French',
  'Fukien',
  'Fuquing',
  'Fuzhou',
  'German',
  'Greek',
<<<<<<< HEAD
  'Gujarati',
  'Hakha Chin',
  'Hakka',
  'Hebrew',
  'Hindi',
  'Hindi',
  'Hmong',
=======
  'Hakka',
  'Hakha chin',
  'Hindi',
>>>>>>> [web][api]
  'Hungarian',
  'Igbo',
  'Ilocano',
  'Indonesian',
  'Italian',
  'Japanese',
  'Karen',
  'Kinyarwanda',
  'Kirundi',
  'Korean',
  'Kurdish',
  'Kurdish (Kurmanji)',
  'Kurdish (Sorani)',
  'Laotian',
  'Lithuanian',
  'Malay',
  'Malayalam',
  'Mandarin',
  'Mandarin',
  'Nepali',
  'Oromo',
  'Pashto',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Romanian',
  'Russian',
  'Serbian',
  'Shanghainese',
  'Sinhalese',
  'Slovak',
  'Somali',
  'Spanish',
<<<<<<< HEAD
  'Sudanese',
=======
>>>>>>> [web][api]
  'Swahili',
  'Tagalog',
  'Tamil',
  'Teochew',
  'Thai',
  'Thai',
  'Tigri(gna) (yna)',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Vietnamese',
  'Vietnamese <> French',
  'Xinhui',
];

const languageByLowerCaseName: { [lowerCase: string]: string } = {};

for (const lang of languages) {
  languageByLowerCaseName[lang.toLowerCase()] = lang;
}

export function fixLanguageName<
  T extends { languageName: string; language?: string }
>(toFix: T): T {
  const language = toFix.languageName || toFix.language || '';
  return {
    ...toFix,
    languageName: languageByLowerCaseName[language.toLowerCase()] || language,
  };
}
