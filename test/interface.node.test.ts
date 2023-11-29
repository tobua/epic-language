import { test, expect, mock, beforeAll, beforeEach, afterAll, afterEach } from 'bun:test'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { Language, create } from '../index'
import { englishSheet, spanishSheet, chineseSheet, germanSheet } from './data'

const server = setupServer(
  http.get('http://localhost:3000/api/translations/en', () => HttpResponse.json(englishSheet)),
  http.get('http://localhost:3000/api/translations/es', () => HttpResponse.json(spanishSheet)),
  http.get('http://localhost:3000/api/translations/zh', () => HttpResponse.json(chineseSheet)),
  http.get('http://localhost:3000/api/translations/de', () => HttpResponse.json(germanSheet)),
)

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  global.mockLanguage = 'en_US'
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

test('Can fetch from mocked route.', async () => {
  const response = await fetch('http://localhost:3000/api/translations/en')
  const data = await response.json()

  expect(data.title).toBe('My title')
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
