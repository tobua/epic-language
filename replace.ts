import { type ReactNode, cloneElement } from 'react'
import { Replacement } from './types'

export function insertReplacements(
  translation: string,
  replacements?: Replacement | Replacement[],
) {
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

export function replaceBracketsWithChildren(text: string, replacements?: ReactNode[]) {
  if (!replacements || !text.includes('{}')) return text

  const parts = text.split('{}')
  const result: ReactNode[] = []
  let currentIndex = 0

  for (let index = 0; index < parts.length; index += 1) {
    result.push(parts[index])
    if (index < parts.length - 1) {
      currentIndex %= replacements.length
      // @ts-ignore
      result.push(cloneElement(replacements[currentIndex], { key: currentIndex }))
      currentIndex += 1
    }
  }

  return result
}
