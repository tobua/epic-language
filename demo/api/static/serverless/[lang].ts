import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Language } from 'epic-language'
import { it } from 'avait'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const language = request.query.lang as Language
  if (!(language in Language))
    return response.status(500).json({ error: `Missing language "${language}"` })
  const { error, value: sheet } = await it(import(`./${language}.json`, { with: { type: 'json' } }))
  console.log(error, sheet)
  if (error)
    return response.status(500).json({ error: `Sheet for language "${language}" not found!` })
  response.status(200).json(sheet)
}
