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
    if (result.includes(`{${index + 1}}`)) {
      result = result.replace(`{${index + 1}}`, String(replacements[index]))
    } else {
      result = result.replace('{}', String(replacements[index]))
    }
  }

  return result
}

// Other than JSX.Element only string and number are allowed and we check them here.
const isNode = (value: unknown) => typeof value !== 'number' && typeof value !== 'string'

// TODO ReactNode or JSX.Element?
export function replaceBracketsWithChildren(text: string, replacements: Replacement[]) {
  const parts = text.match(/({\d+})|({})|([^{}]+)/g)
  const result: ReactNode[] = []

  if (!parts) return [text]

  parts.forEach((part, partIndex) => {
    if (part.startsWith('{') && part.endsWith('}')) {
      const index = parseInt(part.slice(1, -1), 10)
      if (!Number.isNaN(index) && index <= replacements.length) {
        const replacement = replacements[index - 1]
        if (!isNode(replacement)) {
          result.push(replacement)
        } else {
          // TODO clone necessary?
          result.push(cloneElement(replacements[index - 1] as JSX.Element, { key: index }))
        }
      } else {
        const replacement = replacements.shift()
        result.push(
          isNode(replacement)
            ? cloneElement(replacement as JSX.Element, { key: partIndex })
            : replacement,
        )
      }
    } else {
      result.push(part)
    }
  })

  return result
}
