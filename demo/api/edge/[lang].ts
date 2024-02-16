import { Language } from 'epic-language'
import { translate } from 'epic-language/function'
import { it } from 'avait'
import englishSheet from './en.json'

export const config = {
  runtime: 'edge',
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const language = searchParams.get('lang') as Language
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  const { error, value: sheet } = await it(translate(JSON.stringify(englishSheet), language))
  if (error) return new Response(`Translation for language "${language}" failed!`)
  return new Response(JSON.stringify(sheet), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}
