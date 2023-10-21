import { Text } from 'react-native'
import { create as baseCreate } from './index'
import { Sheet, Sheets, Language } from './types'

export { Language }

export function create<T extends Sheet>(
  translations: T,
  sheets: Sheets<T>,
  defaultLanguage: Language = Language.en,
) {
  return baseCreate({ translations, defaultLanguage, sheets, Type: Text })
}
