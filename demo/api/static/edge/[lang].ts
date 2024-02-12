import { Language } from 'epic-language'
import { it } from 'avait'

export const config = {
  runtime: 'edge',
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const language = searchParams.get('lang') ?? ''
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  console.log(import.meta.url)
  const { error, value: sheet } = await it(import(`./${language}.json`))
  console.log(error, sheet)
  console.log(new URL(`./${language}.json`, import.meta.url))
  const { error: secondError, value: secondSheet } = await it(
    fetch(new URL(`./${language}.json`, import.meta.url)),
  )
  console.log(secondError, secondSheet)
  if (error) return new Response(`Sheet for language "${language}" not found!`)
  return new Response(JSON.stringify(sheet), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}
