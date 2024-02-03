import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { it } from 'avait'
import { translate } from './translate'
import { Language } from './types'
import englishSheet from './test/files/en.json'

const staticHandler = async ({ params: { language }, set }) => {
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  const {
    error,
    value: { default: sheet },
  } = await it(import(`./test/files/${language}.json`))
  if (error) return new Response(`Sheet for language "${language}" not found!`)
  await new Promise((done) => setTimeout(done, 1000)) // Best way to add delay?
  set.headers['language'] = language
  return sheet
}

const dynamicHandler = async ({ params: { language }, set }) => {
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  const { error, value: sheet } = await it(translate(JSON.stringify(englishSheet), language))
  if (error) return new Response(`Translation for language "${language}" failed!`)
  await new Promise((done) => setTimeout(done, 1000)) // Best way to add delay?
  set.headers['language'] = language
  return sheet
}

new Elysia()
  .use(cors())
  .get('/api/serverless/:language', dynamicHandler)
  .get('/api/edge/:language', dynamicHandler)
  .get('/api/static/serverless/:language', dynamicHandler)
  .get('/api/static/edge/:language', dynamicHandler)
  .listen(3001)

console.log(
  'Local server running! Make sure to run "bun server:files" to ensure all languages are available.',
)
