/// <reference lib="dom" />

import { test, expect, mock, beforeAll, afterAll } from 'bun:test'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { Language, translations } from '../index'

const server = setupServer(
  rest.get('http://localhost:3000/api/translations/en', (req, res, ctx) =>
    res(ctx.json({ title: 'My Title', description: 'This is the description.' })),
  ),
  rest.get('http://localhost:3000/api/translations/es', (req, res, ctx) =>
    res(ctx.json({ title: 'Mi Título', description: 'Esta es la descripción.' })),
  ),
  rest.get('http://localhost:3000/api/translations/zh', (req, res, ctx) =>
    res(ctx.json({ title: '我的标题', description: '这是描述。' })),
  ),
  rest.get('http://localhost:3000/api/translations/de', (req, res, ctx) =>
    res(ctx.json({ title: 'Mein Titel', description: 'Das ist meine Beschreibung.' })),
  ),
)

beforeAll(() => {
  global.mockLanguage = 'en_US'
  server.listen()
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
  const { translate } = translations(
    { title: 'My Title', description: 'This is the description.' },
    'http://localhost:3000/api/translations',
    onLoad,
    Language.en,
  )

  expect(translate('title')).toBe('My Title')
  expect(onLoad).not.toHaveBeenCalled()

  await new Promise((done) => {
    setTimeout(done, 1000)
  })

  expect(onLoad).toHaveBeenCalled()
  expect(translate('title')).toBe('Mein Titel')
})
