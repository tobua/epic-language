import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'
import { it } from 'avait'
import { translate } from './translate'
import { Language } from './types'
import translations from './translations.json'

const handler = async ({ params: { language }, set }) => {
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  const { error, value: sheet } = await it(translate(JSON.stringify(translations), language))
  if (error) return new Response(`Translation for language "${language}" failed!`)
  await new Promise((done) => setTimeout(done, 1000)) // Best way to add delay?
  set.headers['language'] = language
  return Response.json(sheet)
}

new Elysia()
  .use(cors())
  .use(staticPlugin({ assets: 'test/translation', prefix: 'translation' }))
  .get('/api/serverless/:language', handler)
  .get('/api/edge/:language', handler)
  .listen(3001)

console.log(
  'Local server running! Make sure to run "bun server:files" to ensure all languages are available.',
)
