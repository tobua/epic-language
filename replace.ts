import { type ReactNode, cloneElement } from 'react'
import type React from 'react'
import type { Replacement } from './types'

export function insertReplacements(translation: string, replacements?: Replacement | Replacement[]) {
  if (typeof replacements === 'undefined') return translation

  if (!Array.isArray(replacements)) {
    // biome-ignore lint/style/noParameterAssign: Much easier in this case.
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
      const index = Number.parseInt(part.slice(1, -1), 10)
      if (!Number.isNaN(index) && index <= replacements.length) {
        const replacement = replacements[index - 1]
        if (isNode(replacement)) {
          // TODO clone necessary?
          result.push(cloneElement(replacements[index - 1] as React.JSX.Element, { key: index }))
        } else {
          result.push(replacement)
        }
      } else {
        const replacement = replacements.shift()
        result.push(isNode(replacement) ? cloneElement(replacement as React.JSX.Element, { key: partIndex }) : replacement)
      }
    } else {
      result.push(part)
    }
  })

  return result
}
