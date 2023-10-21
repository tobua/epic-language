import { create } from 'logua'
import { Language } from './types'

export const log = create('epic-language', 'magenta')

// TODO for validation and country specific locales.
// Intl.getCanonicalLocales("EN-US"); // ["en-US"]

export const readableLanguage = {
  [Language.en]: 'English',
  [Language.es]: 'Spanish',
  [Language.zh]: 'Chinese',
  [Language.de]: 'German',
  [Language.fr]: 'French',
  [Language.it]: 'Italian',
}
