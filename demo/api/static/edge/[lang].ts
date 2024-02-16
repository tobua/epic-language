import { Language } from 'epic-language'
import { it } from 'avait'
import chineseSheet from './zh.json'

export const config = {
  runtime: 'edge',
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const language = searchParams.get('lang') ?? ''
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  const { error, value: sheet } = await it(import(`./api/static/edge/${language}.json`))
  console.log(error, sheet, chineseSheet)
  const { error1, value: sheet1 } = await it(import(`./demo/api/static/edge/${language}.json`))
  console.log(error1, sheet1)
  const { error2, value: sheet2 } = await it(import(`./${language}.json`))
  console.log(error2, sheet2)
  if (error) return new Response(`Sheet for language "${language}" not found!`)
  return new Response(JSON.stringify(sheet), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}
