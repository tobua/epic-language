export function Text(props: any) {
  return <p {...props} />
}

export const Platform = {
  OS: 'android',
}

export const Settings = {
  get: (setting: string) => {
    if (setting === 'AppleLocale') {
      return 'en_US'
    }
    if (setting === 'AppleLanguages') {
      return ['en_US']
    }

    return 'en_US'
  },
}

export const I18nManager = {
  getConstants: () => ({
    localeIdentifier: 'en_US',
  }),
}
