import { test, expect, mock, beforeEach, type Mock } from 'bun:test'
import { Language, create } from '../index'
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

  await delay(0.1)

  expect(onLoad).toHaveBeenCalled()
  expect(translate('title')).toBe(germanSheet.title)
})

test('Different translations can are loaded.', async () => {
  globalThis.mockLanguage = 'zh_CN'
  const onLoad = mock(() => {})
  const { translate, language } = create({
    translations: englishSheet,
    route: 'http://localhost:3000/api/translations',
    onLoad,
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
  const onLoad = mock(() => {})
  const { translate, language } = create({
    translations: englishSheet,
    route: 'http://localhost:3000/api/translations',
    onLoad,
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
