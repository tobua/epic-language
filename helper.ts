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
}
