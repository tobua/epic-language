import { Language, create as baseCreate, readableLanguage } from 'epic-language'
// @ts-ignore Avoid user errors when not installed (all exports are checked).
import { I18nManager, Platform, Settings, Text } from 'react-native'
import type { Sheet, Sheets } from './types'

export { Language, readableLanguage }

function getNativeLanguage(defaultLanguage: Language) {
  // https://stackoverflow.com/questions/33468746/whats-the-best-way-to-get-device-locale-in-react-native-ios/42655021
  let locale = Platform.OS === 'android' ? I18nManager.getConstants().localeIdentifier : Settings.get('AppleLocale')

  if (locale) {
    locale = (locale as string).replace('_', '-')
    locale = locale.split('@')[0] ?? '' // Remove region.
  } else {
    locale = Settings.get('AppleLanguages')[0] ?? ''
    if (locale === undefined) {
      locale = defaultLanguage
    }
  }

  return locale.substring(0, 2) as Language
}

export function create<T extends Sheet>(translations: T, sheets: Sheets<T>, defaultLanguage: Language = Language.en) {
  return baseCreate({
    translations,
    defaultLanguage,
    sheets,
    as: Text,
    getLanguage: getNativeLanguage,
  })
}
