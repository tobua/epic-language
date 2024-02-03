import { Language } from 'epic-language'
import { it } from 'avait'

export const config = {
  runtime: 'edge',
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const language = searchParams.get('lang') ?? ''
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  const { error, value: sheet } = await it(import(`../translations/${language}.json`))
  if (error) return new Response(`Sheet for language "${language}" not found!`)
  return new Response(JSON.stringify(sheet), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}
