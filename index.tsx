import React, { useRef, useEffect } from 'react'
import { log } from './helper'
import { Sheets, Sheet, Language, Replacement, TextProps } from './types'
import { insertReplacements, replaceBracketsWithChildren } from './replace'

export { Language }

const has = (object: object, key: string | number | symbol) => Object.hasOwn(object, key)

function getLanguage(defaultLanguage: Language) {
  // @ts-ignore dom lib is added...
  const language = (global.mockLanguage ?? window.navigator.language).substring(0, 2)
  if (Object.values(Language).includes(language as Language)) return language
  return defaultLanguage
}

async function loadSheet(
  language: Language,
  sheets: Sheets,
  apiRoute: string,
  onLoad: () => void,
  defaultLanguage: Language,
) {
  if (language === defaultLanguage) return onLoad()
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
export function translations<T extends Sheet>(
  defaultTranslations: T,
  apiRoute: string,
  onLoad: () => void = () => {},
  defaultLanguage: Language = Language.en,
) {
  const sheets: Sheets = {}
  const userLanguage = getLanguage(defaultLanguage)
  sheets[defaultLanguage] = defaultTranslations

  loadSheet(userLanguage, sheets, apiRoute, onLoad, defaultLanguage)

  function translate(
    key: keyof T,
    replacements?: Replacement | Replacement[],
    language: Language = userLanguage,
  ) {
    const sheet = sheets[language]
    if (!sheet || !has(sheet, key)) {
      if (process.env.NODE_ENV !== 'production') {
        log(`Translation for key "${String(key)}" for language ${language} is missing`, 'warning')
      }
      return (sheets[defaultLanguage] as Sheet)[key as string] ?? key
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
    as?: 'div' | 'span' | 'p'
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
      // Native replacement onLoad.
      // console.log('effect', ref.current)
    }, [])

    return (
      <Component ref={ref} {...props}>
        {filledContent}
      </Component>
    )
  }

  return { translate, Text }
}
