import { test, expect, mock, beforeAll, beforeEach, afterAll } from 'bun:test'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { Language, create } from '../index'
import { englishSheet, spanishSheet, chineseSheet, germanSheet } from './data'

const server = setupServer(
  rest.get('http://localhost:3000/api/translations/en', (req, res, ctx) =>
    res(ctx.json(englishSheet)),
  ),
  rest.get('http://localhost:3000/api/translations/es', (req, res, ctx) =>
    res(ctx.json(spanishSheet)),
  ),
  rest.get('http://localhost:3000/api/translations/zh', (req, res, ctx) =>
    res(ctx.json(chineseSheet)),
  ),
  rest.get('http://localhost:3000/api/translations/de', (req, res, ctx) =>
    res(ctx.json(germanSheet)),
  ),
)

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  global.mockLanguage = 'en_US'
})

afterAll(() => {
  server.close()
})

test('Translations are loaded from serverless function.', async () => {
  //   server.use(
  //     rest.get('http://localhost:3000/api/translations/de', (req, res, ctx) =>
  //       res(ctx.json({ title: 'Mein Titel', description: 'Das ist meine Beschreibung.' })),
  //     ),
  //   )

  global.mockLanguage = 'de_CH'
  const onLoad = mock(() => {})
  const { translate, language } = create({
    translations: englishSheet,
    route: 'http://localhost:3000/api/translations',
    onLoad,
    defaultLanguage: Language.en,
  })

  expect(language).toBe(Language.de)
  expect(translate('title', undefined, Language.en)).toBe(englishSheet.title)
  expect(translate('title')).toBe('title')
  expect(onLoad).not.toHaveBeenCalled()

  await new Promise((done) => {
    setTimeout(done, 1000)
  })

  expect(onLoad).toHaveBeenCalled()
  expect(translate('title')).toBe(germanSheet.title)
})
