import { Language } from 'epic-language'
import { it } from 'avait'

export default async function handler(request, response) {
  const language = request.query.lang
  if (!(language in Language))
    return response.status(500).json({ error: `Missing language "${language}"` })
  const {
    error,
    value: { default: sheet },
  } = await it(import(`./${language}.json`, { assert: { type: 'json' } }))
  if (error)
    return response.status(500).json({ error: `Sheet for language "${language}" not found!` })
  response.status(200).json(sheet)
}
