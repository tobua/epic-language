import { create } from 'logua'
import { Language } from './types'

export const log = create('epic-language', 'magenta')

export const readableLanguage = {
  [Language.en]: 'English',
  [Language.es]: 'Spanish',
  [Language.zh]: 'Chinese',
  [Language.de]: 'German',
  [Language.fr]: 'French',
  [Language.it]: 'Italian',
}
