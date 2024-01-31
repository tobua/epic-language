import { test, expect, mock, beforeEach, type Mock } from 'bun:test'
import { Language, State, States, create } from '../index'
import { englishSheet, spanishSheet, chineseSheet, germanSheet } from './data'

const apiResponses = {
  'http://localhost:3000/api/translations/en': englishSheet,
  'http://localhost:3000/api/translations/es': spanishSheet,
  'http://localhost:3000/api/translations/zh': chineseSheet,
  'http://localhost:3000/api/translations/de': germanSheet,
}

const delay = (time: number) =>
  new Promise((done) => {
    setTimeout(done, time * 1000)
  })

// @ts-ignore
global.fetch = mock(async (url) => {
  const response = apiResponses[url]
  await delay(0.1)
  return { json: async () => response }
})

beforeEach(() => {
  globalThis.mockLanguage = 'en_US'
})

test('Can fetch from mocked route.', async () => {
  const response = await fetch('http://localhost:3000/api/translations/en')
  const data = await response.json()

  expect(data.title).toBe('My Title')
})

test('Translations are loaded from serverless function.', async () => {
  globalThis.mockLanguage = 'de_CH'
  const { translate, language } = create({
    translations: englishSheet,
    route: 'http://localhost:3000/api/translations',
    defaultLanguage: Language.en,
  })

  expect(language).toBe(Language.de)
  expect(translate('title', undefined, Language.en)).toBe(englishSheet.title)
  expect(translate('title')).toBe('title')
  expect(State.current).toBe(States.loading)

  await delay(0.1)

  expect(State.current).toBe(States.ready)
  expect(translate('title')).toBe(germanSheet.title)
})

test('Different translations can are loaded.', async () => {
  globalThis.mockLanguage = 'zh_CN'
  const { translate, language } = create({
    translations: englishSheet,
    route: 'http://localhost:3000/api/translations',
    defaultLanguage: Language.en,
  })

  expect(language).toBe(Language.zh)
  expect(translate('title')).toBe('title')

  await delay(0.1)

  expect(translate('title')).toBe(chineseSheet.title)

  expect(translate('title', undefined, Language.es)).toBe('title')

  await delay(0.1)

  expect(translate('title', undefined, Language.es)).toBe(spanishSheet.title)
})

test('Will not load sheets for non-existing languages.', async () => {
  const fetchMock = global.fetch as Mock<any>
  fetchMock.mockReset()
  globalThis.mockLanguage = 'ab_CD'
  const { translate, language } = create({
    translations: englishSheet,
    route: 'http://localhost:3000/api/translations',
    // @ts-expect-error
    defaultLanguage: 'ab',
  })

  expect(fetchMock.mock.calls.length).toBe(0)

  expect(language).toBe(Language.en)
  expect(translate('title')).toBe(englishSheet.title)

  await delay(0.1)

  expect(translate('title')).toBe(englishSheet.title)

  // @ts-expect-error
  expect(translate('title', undefined, 'ef')).toBe(englishSheet.title)

  await delay(0.1)

  // @ts-expect-error
  expect(translate('title', undefined, 'ef')).toBe(englishSheet.title)

  expect(fetchMock.mock.calls.length).toBe(0)
})
