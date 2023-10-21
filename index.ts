import { useRef, useEffect, createElement } from 'react'
import { type Text as NativeText } from 'react-native'
import { log, readableLanguage } from './helper'
import { Sheets, Sheet, Language, Replacement, TextProps } from './types'
import { insertReplacements, replaceBracketsWithChildren } from './replace'

export { Language, readableLanguage }

const has = (object: object, key: string | number | symbol) => Object.hasOwn(object, key)

function getBrowserLanguage(defaultLanguage: Language) {
  // @ts-ignore dom lib is added...
  const locale = global.mockLanguage ?? window.navigator?.language ?? defaultLanguage
  const language = locale.substring(0, 2) as Language
  if (Object.values(Language).includes(language)) return language
  return defaultLanguage
}

async function loadSheet<T extends Sheet>(
  language: Language,
  sheets: Sheets<T>,
  apiRoute: string,
  onLoad: () => void,
  defaultLanguage: Language,
) {
  if (language === defaultLanguage || sheets[language]) return onLoad()
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (done) => {
    const response = await fetch(`${apiRoute}/${language}`)
    const data = await response.json()

    sheets[language] = data
    onLoad()
    done()
  })
}

// defaultLanguage is the language in the standard translation that's always loaded.
export function create<T extends Sheet>({
  translations,
  route,
  onLoad = () => {},
  defaultLanguage = Language.en,
  sheets = {},
  languages = Object.keys(Language),
  Type = 'span',
  getLanguage = getBrowserLanguage,
}: {
  translations: T
  route?: string
  onLoad?: () => void
  defaultLanguage?: Language
  sheets?: Sheets<T>
  languages?: string[]
  Type?: 'span' | 'p' | 'div' | 'a' | 'button' | typeof NativeText
  getLanguage?: (language: Language) => Language
}) {
  let userLanguage = getLanguage(defaultLanguage)
  sheets[defaultLanguage] = translations

  loadSheet(userLanguage, sheets, route, onLoad, defaultLanguage)

  function translate(
    key: keyof T,
    replacements?: Replacement | Replacement[],
    language: Language = userLanguage,
  ) {
    const sheet = sheets[languages.includes(language) ? language : defaultLanguage]
    if (!sheet || !has(sheet, key)) {
      if (process.env.NODE_ENV !== 'production') {
        log(`Translation for key "${String(key)}" for language ${language} is missing`, 'warning')
      }
      return (sheet ?? {})[key as string] ?? key
    }
    return insertReplacements(sheet[key as string], replacements)
  }

  function Text({
    as = 'span',
    id,
    replacements,
    language = defaultLanguage,
    children,
    ...props
  }: {
    as?: typeof Type
    id?: keyof T
    replacements?: Replacement | Replacement[]
    language?: Language
    children?: string // text in JSX always has the type string.
  } & TextProps) {
    const ref = useRef(null)
    const key = id ?? (children as keyof T)
    const sheet = (sheets[language] ?? {}) as Sheet<keyof T>
    const defaultSheet = (sheets[defaultLanguage] ?? {}) as Sheet<keyof T>
    const translation = sheet[key] ?? defaultSheet[key] ?? String(key)
    const Component = as
    const filledContent = replaceBracketsWithChildren(
      translation,
      Array.isArray(children) ? children : [children],
    )

    useEffect(() => {
      // TODO Native replacement onLoad.
      // console.log('effect', ref.current)
    }, [])

    // @ts-ignore Issues with ref.
    return createElement(Component, { ...props, ref }, filledContent)
  }

  function setLanguage(language: Language) {
    userLanguage = language
    loadSheet(language, sheets, route, onLoad, defaultLanguage)
  }

  return { translate, Text, language: userLanguage, setLanguage }
}
