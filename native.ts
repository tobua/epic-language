// @ts-ignore Somehow not part of RN types, but available in old and new architecture...
import { Text, Platform, I18nManager, Settings } from 'react-native'
import { create as baseCreate, readableLanguage, Language } from 'epic-language'
import { Sheet, Sheets } from './types'

export { Language, readableLanguage }

function getNativeLanguage(defaultLanguage: Language) {
  // https://stackoverflow.com/questions/33468746/whats-the-best-way-to-get-device-locale-in-react-native-ios/42655021
  let locale =
    Platform.OS === 'android'
      ? I18nManager.getConstants().localeIdentifier
      : Settings.get('AppleLocale')

  if (!locale) {
    ;[locale] = Settings.get('AppleLanguages')
    if (locale === undefined) {
      locale = defaultLanguage
    }
  } else {
    locale = locale.replace('_', '-')
    ;[locale] = locale.split('@') // Remove region.
  }

  return locale.substring(0, 2) as Language
}

export function create<T extends Sheet>(
  translations: T,
  sheets: Sheets<T>,
  defaultLanguage: Language = Language.en,
) {
  return baseCreate({
    translations,
    defaultLanguage,
    sheets,
    as: Text,
    getLanguage: getNativeLanguage,
  })
}
