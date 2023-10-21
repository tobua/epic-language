import { Text, Platform, NativeModules } from 'react-native'
import { create as baseCreate, readableLanguage, Language } from 'epic-language'
import { Sheet, Sheets } from './types'

export { Language, readableLanguage }

function getNativeLanguage(defaultLanguage: Language) {
  // https://stackoverflow.com/questions/33468746/whats-the-best-way-to-get-device-locale-in-react-native-ios/42655021
  let locale =
    Platform.OS === 'android'
      ? NativeModules.I18nManager.localeIdentifier
      : NativeModules.SettingsManager.settings.AppleLocale

  if (!locale) {
    ;[locale] = NativeModules.SettingsManager.settings.AppleLanguages
    if (locale === undefined) {
      locale = defaultLanguage
    }
  } else {
    locale = locale.replace('_', '-')
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
    Type: Text,
    getLanguage: getNativeLanguage,
  })
}
