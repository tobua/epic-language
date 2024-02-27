import { readFileSync } from 'fs'
import { it } from 'avait'
import { Language } from 'epic-language'
import { translate } from 'epic-language/function'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const language = request.query.lang as Language
  if (!(language in Language))
    return response.status(500).json({ error: `Missing language "${language}"` })
  const englishSheet = JSON.parse(
    readFileSync(new URL('../../data/en.json', import.meta.url), 'utf8'),
  )
  const { error, value: sheet } = await it(translate(JSON.stringify(englishSheet), language))
  if (error)
    return response.status(500).json({ error: `Translation for language "${language}" failed!` })
  response.status(200).json(sheet)
}
