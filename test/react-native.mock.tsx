import React from 'react'

export function Text(props: any) {
  return <p {...props} />
}

export const Platform = {
  OS: 'android',
}

export const NativeModules = {
  I18nManager: {
    localeIdentifier: 'en_US',
  },
  SettingsManager: {
    settings: {
      AppleLocale: 'en_US',
      AppleLanguages: ['en_US'],
    },
  },
}
