import { Language } from 'epic-language'
import { translate } from 'epic-language/function'
import { promises as fs } from 'fs'
import { it } from 'avait'
import englishSheetImport from './en.json'

export default async function handler(request, response) {
  console.log(process.cwd(), new URL('./en.json', import.meta.url), englishSheetImport)
  const language = request.query.lang
  if (!(language in Language))
    return response.status(500).json({ error: `Missing language "${language}"` })
  const englishSheet = JSON.parse(await fs.readFile(new URL('./en.json', import.meta.url), 'utf8'))
  const { error, value: sheet } = await it(translate(JSON.stringify(englishSheet), language))
  if (error)
    return response.status(500).json({ error: `Translation for language "${language}" failed!` })
  response.status(200).json(sheet)
}
