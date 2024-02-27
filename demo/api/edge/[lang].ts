import { it } from 'avait'
import { Language } from 'epic-language'
import { translate } from 'epic-language/function'
import translations from '../../translations.json'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const language = searchParams.get('lang') as Language
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  const { error, value: sheet } = await it(translate(JSON.stringify(translations), language))
  if (error) return new Response(`Translation for language "${language}" failed!`)
  return Response.json(sheet)
}
