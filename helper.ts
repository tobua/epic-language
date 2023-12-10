import { create } from 'logua'
import { Language, Languages } from './types'

export const log = create('epic-language', 'magenta')

// TODO for validation and country specific locales.
// Intl.getCanonicalLocales("EN-US"); // ["en-US"]

export const readableLanguage: Record<Languages, string> = {
  [Language.en]: 'English',
  [Language.es]: 'Idioma',
  [Language.zh]: '语言',
  [Language.de]: 'Deutsch',
  [Language.fr]: 'Français',
  [Language.it]: 'Italiano',
  [Language.hi]: 'हिन्दी',
  [Language.ja]: '日本語',
  [Language.ko]: '한국어',
  [Language.pt]: 'Português',
  [Language.ru]: 'русский язык',
  [Language.ar]: 'اَلْعَرَبِيَّةُ',
  [Language.bn]: 'বাংলা',
  [Language.vi]: 'Tiếng Việt',
  [Language.tr]: 'Türkçe',
  [Language.fa]: 'فارسی',
}
