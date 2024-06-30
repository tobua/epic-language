import { useRef, useEffect, createElement, type ReactNode } from 'react'
import { type Text as NativeText } from 'react-native'
import { log, readableLanguage } from './helper'
import { Sheets, Sheet, Language, Replacement, TextProps, Model } from './types'
import { insertReplacements, replaceBracketsWithChildren } from './replace'
import { States, State, type Listener } from './state'

export { Language, readableLanguage, Model }
export { States, State, Listener }

const has = (object: object, key: string | number | symbol) => Object.hasOwn(object, key)

function getBrowserLanguage(defaultLanguage: Language) {
  // @ts-ignore dom lib is added...
  const locale = globalThis.mockLanguage ?? window.navigator?.language ?? defaultLanguage
  const language = locale.substring(0, 2) as Language
  if (Object.values(Language).includes(language)) return language
  return defaultLanguage
}

async function loadSheet<T extends Sheet>(language: Language, sheets: Sheets<T>, apiRoute: string) {
  if (sheets[language]) return State.ready(language)
  if (State.loadingLanguages.includes(language)) return undefined

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (done) => {
    State.load(language)
    const response = await fetch(apiRoute.replace('[language]', language))
    const data = await response.json()

    sheets[language] = data
    State.ready(language)
    done()
  })
}

// defaultLanguage is the language in the standard translation that's always loaded.
export function create<T extends Sheet>({
  translations,
  route,
  defaultLanguage = Language.en,
  sheets = {},
  languages = Object.keys(Language),
  Type = 'span',
  getLanguage = getBrowserLanguage,
}: {
  translations?: T
  route?: string
  defaultLanguage?: Language
  sheets?: Sheets<T>
  languages?: string[]
  Type?: 'span' | 'p' | 'div' | 'a' | 'button' | typeof NativeText
  getLanguage?: (language: Language) => Language
}) {
  if (!(defaultLanguage in Language)) {
    log(
      `Trying to initialize with missing language "${defaultLanguage}", falling back to "${
        readableLanguage[Language.en].english
      }`,
      'warning',
    )
    // eslint-disable-next-line no-param-reassign
    defaultLanguage = Language.en
  }

  let userLanguage = getLanguage(defaultLanguage)
  if (translations) {
    sheets[defaultLanguage] = translations
  }

  loadSheet(userLanguage, sheets, route)

  function translate(
    key: keyof T,
    replacements?: Replacement | Replacement[],
    language: Language = userLanguage,
  ) {
    if (!(language in Language)) {
      log(
        `Trying to translate missing language "${language}", falling back to "${readableLanguage[defaultLanguage].english}`,
        'warning',
      )
      // eslint-disable-next-line no-param-reassign
      language = defaultLanguage
    }

    const sheet = sheets[languages.includes(language) ? language : defaultLanguage]
    if (!sheet || !has(sheet, key)) {
      if (process.env.NODE_ENV !== 'production') {
        log(`Translation for key "${String(key)}" for language ${language} is missing`, 'warning')
        loadSheet(language, sheets, route)
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
    const possibleReplacements = id && !replacements ? children : replacements
    const arrayReplacements = Array.isArray(possibleReplacements)
      ? possibleReplacements
      : [possibleReplacements]
    let filledContent: ReactNode = translation

    if (arrayReplacements.length > 0) {
      filledContent = replaceBracketsWithChildren(translation, arrayReplacements)
    }

    useEffect(() => {
      // State.listen()
      // TODO Native replacement onLoad.
      // console.log('effect', ref.current)
    }, [])

    return createElement(Component, { ...props, ref }, filledContent)
  }

  function setLanguage(language: Language) {
    userLanguage = language
    loadSheet(language, sheets, route)
  }

  return { translate, Text, language: userLanguage, setLanguage }
}
