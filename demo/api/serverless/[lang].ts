import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Language } from 'epic-language'
import { translate } from 'epic-language/function'
import englishSheet from '../en.json'
import { it } from 'avait'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const language = request.query.lang as Language
  if (!(language in Language))
    return response.status(500).json({ error: `Missing language "${language}"` })
  const { error, value: sheet } = await it(translate(JSON.stringify(englishSheet), language))
  if (error)
    return response.status(500).json({ error: `Translation for language "${language}" failed!` })
  response.status(200).json(sheet)
}
