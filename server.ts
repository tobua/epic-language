import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { it } from 'avait'
import { Language } from './types'

new Elysia()
  .use(cors())
  .get('/api/static/serverless/:language', async ({ params: { language } }) => {
    if (!(language in Language)) return new Response(`Missing language "${language}"`)

    const { error, value } = await it(import(`./test/files/${language}.json`))

    if (error) return new Response(`Sheet for language "${language}" not found!`)

    await new Promise((done) => setTimeout(done, 1000)) // Best way to add delay?

    return {
      ...value.default,
      language,
    }
  })
  .listen(3001)

console.log(
  'Local server running! Make sure to run "bun server:files" to ensure all languages are available.',
)
