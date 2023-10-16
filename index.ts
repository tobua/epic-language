// import { DetailedHTMLProps, HTMLAttributes, cloneElement } from 'react'
import { log } from './helper'

type Sheet = { [key: string]: string }
type Sheets = { [key in Language]?: Sheet }
type Replacement = string | number

const sheets: Sheets = {}

export enum Language {
  en = 'en',
  es = 'es',
  cn = 'cn',
  de = 'de',
  fr = 'fr',
  it = 'it',
}

const has = (object: object, key: string | number | symbol) => Object.hasOwn(object, key)

function getLanguage(defaultLanguage: Language) {
  // @ts-ignore dom lib is added...
  const language = window.navigator.language.substring(0, 2)
  if (Object.values(Language).includes(language as Language)) {
    return language
  }
  return defaultLanguage
}

async function loadSheet(apiRoute: string, onLoad: () => void, defaultLanguage: Language) {
  const language = getLanguage(defaultLanguage)
  if (language === defaultLanguage) return onLoad()
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (done) => {
    const response = await fetch(`${apiRoute}/language`)
    const data = await response.json()

    sheets[language] = data
    onLoad()
    done()
  })
}

function insertReplacements(translation: string, replacements?: Replacement | Replacement[]) {
  if (!replacements) return translation

  if (!Array.isArray(replacements)) {
    // eslint-disable-next-line no-param-reassign
    replacements = [replacements]
  }

  let result = translation
  for (let index = 0; index < replacements.length; index += 1) {
    result = result.replace('{}', String(replacements[index]))
  }
  return result
}

// defaultLanguage is the language in the standard translation that's always loaded.
export function translations<T extends Sheet>(
  defaultTranslations: T,
  apiRoute: string,
  onLoad: () => void = () => {},
  defaultLanguage: Language = Language.en,
) {
  sheets[defaultLanguage] = defaultTranslations

  loadSheet(apiRoute, onLoad, defaultLanguage)

  function translate(
    key: keyof T,
    replacements?: Replacement | Replacement[],
    language: Language = defaultLanguage,
  ) {
    const sheet = sheets[language]
    if (!has(sheet, key)) {
      log(`Translation for key "${String(key)}" is missing`)
      if (Object.hasOwn(sheets[defaultLanguage], key)) return sheets[defaultLanguage][key as string]
      return key
    }
    return insertReplacements(sheet[key as string], replacements)
  }

  return { translate }
}

// function replaceBracketsWithChildren(text: string, replacements: JSX.Element | JSX.Element[]) {
//   let currentIndex = 0

//   if (!Array.isArray(replacements)) {
//     replacements = [replacements]
//   }

//   const parts = text.split('{}')
//   const result = []

//   for (let i = 0; i < parts.length; i++) {
//     result.push(parts[i])
//     if (i < parts.length - 1) {
//       currentIndex = currentIndex % replacements.length
//       result.push(cloneElement(replacements[currentIndex], { key: currentIndex }))
//       currentIndex++
//     }
//   }

//   return result
// }

// TODO ref for native textnode replacements.
// function TranslatedText({
//   as = 'span',
//   id,
//   language,
//   children,
//   ...props
// }: {
//   as?: 'div' | 'span' | 'p'
//   id: keyof typeof translations
//   language: Language
//   children: any | any[]
// } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
//   const content = translations[id][language]
//   const Component = as

//   const filledContent = replaceBracketsWithChildren(content, children)

//   console.log(filledContent, content, children)

//   return (
//     <Component style={styles.congratulations} {...props}>
//       {filledContent}
//     </Component>
//   )
// }
