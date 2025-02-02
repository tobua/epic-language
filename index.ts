import { type ReactNode, createElement, useEffect, useRef } from 'react'
// @ts-ignore Avoid user errors when not installed.
import type { Text as NativeText } from 'react-native'
import { log, readableLanguage } from './helper'
import { insertReplacements, replaceBracketsWithChildren } from './replace'
import { type Listener, State, States } from './state'
import { Language, Model, type Replacement, type Sheet, type Sheets, type TextProps } from './types'

export { Language, readableLanguage, Model }
export { States, State, type Listener }

function getBrowserLanguage(defaultLanguage: Language) {
  // @ts-ignore dom lib is added...
  const locale = globalThis.mockLanguage ?? window.navigator?.language ?? defaultLanguage
  const language = locale.substring(0, 2) as Language
  if (Object.values(Language).includes(language)) return language
  return defaultLanguage
}

function loadSheet<T extends Sheet>(language: Language, sheets: Sheets<T>, apiRoute?: string) {
  if (!apiRoute) return undefined
  if (sheets[language]) return State.ready(language)
  if (State.loadingLanguages.includes(language)) return undefined

  // biome-ignore lint/suspicious/noAsyncPromiseExecutor: Seems necessary.
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
  as = 'span',
  getLanguage = getBrowserLanguage,
}: {
  translations?: T
  route?: string
  defaultLanguage?: Language
  sheets?: Sheets<T>
  languages?: string[]
  as?: 'span' | 'p' | 'div' | 'a' | 'button' | typeof NativeText
  getLanguage?: (language: Language) => Language
}) {
  if (!(defaultLanguage in Language)) {
    log(
      `Trying to initialize with missing language "${defaultLanguage}", falling back to "${readableLanguage[Language.en].english}`,
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

  function translate(key: keyof T, replacements?: Replacement | Replacement[], language: Language = userLanguage) {
    if (!(language in Language)) {
      log(`Trying to translate missing language "${language}", falling back to "${readableLanguage[defaultLanguage].english}`, 'warning')
      // biome-ignore lint/style/noParameterAssign: Much easier in this case.
      language = defaultLanguage
    }

    const sheet = sheets[languages.includes(language) ? language : defaultLanguage]
    if (!sheet?.[key]) {
      if (process.env.NODE_ENV !== 'production') {
        log(`Translation for key "${String(key)}" for language ${language} is missing`, 'warning')
        loadSheet(language, sheets, route)
      }
      return sheet?.[key as string] ?? String(key)
    }
    return insertReplacements(sheet[key as string] as string, replacements)
  }

  function Text({
    id,
    replacements,
    language = defaultLanguage,
    children,
    ...props
  }: {
    as?: typeof as
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
    const Component = props.as ?? as
    const possibleReplacements = id && !replacements ? children : replacements
    const arrayReplacements = Array.isArray(possibleReplacements) ? possibleReplacements : [possibleReplacements]
    const replacementsFiltered = arrayReplacements.filter((item) => !!item) as Replacement[]
    let filledContent: ReactNode = translation

    if (arrayReplacements.length > 0) {
      filledContent = replaceBracketsWithChildren(translation, replacementsFiltered)
    }

    useEffect(() => {
      // State.listen()
      // TODO Native replacement onLoad.
      // console.log('effect', ref.current)
    }, [])

    // @ts-ignore TODO is ref even necessary?
    return createElement(Component, { ...props, ref }, filledContent)
  }

  function setLanguage(language: Language) {
    userLanguage = language
    loadSheet(language, sheets, route)
  }

  return { translate, Text, language: userLanguage, setLanguage }
}
