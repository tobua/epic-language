/// <reference lib="dom" />

import './setup-dom'
import { test, expect, mock, beforeEach } from 'bun:test'
import { Language, create } from '../index'
import { englishSheet, spanishSheet, chineseSheet, germanSheet } from './data'

beforeEach(() => {
  globalThis.mockLanguage = 'en_US'
})

test('Translates key in initially provided language.', () => {
  const onLoad = mock(() => {})
  const { translate } = create({
    translations: englishSheet,
    route: '/api/translations',
    onLoad,
    defaultLanguage: Language.en,
  })

  expect(translate('title')).toBe(englishSheet.title)
  expect(translate('description')).toBe(englishSheet.description)
  // @ts-expect-error
  expect(translate('missing')).toBe('missing')
  expect(onLoad).toHaveBeenCalled()
})

test('Symbols or numbers cannot be used as keys.', () => {
  // TODO doesn't seem possible to restrict keys to string when using generic type with extends.
  const onLoad = mock(() => {})
  const symbol = Symbol('test')
  const { translate } = create({
    translations: { [symbol]: 'My Symbol', 5: 'My Number' },
    route: '/api/translations',
    onLoad,
    defaultLanguage: Language.en,
  })

  expect(translate(symbol)).toBe('My Symbol')
  expect(translate(5)).toBe('My Number')
  // @ts-expect-error
  expect(translate('missing')).toBe('missing')
  expect(onLoad).toHaveBeenCalled()
})

test('Replacements are inserted.', () => {
  const { translate } = create({
    translations: { counter: 'Count: {}' },
    route: '/api/translations',
  })

  expect(translate('counter', '123')).toBe('Count: 123')
  expect(translate('counter', 456)).toBe('Count: 456')
})

test('Multiple sheets can be provided initially.', () => {
  globalThis.mockLanguage = 'es-ES'

  const onLoad = mock(() => {})
  const { translate } = create({
    translations: spanishSheet,
    route: '/api/translations',
    onLoad,
    defaultLanguage: Language.es,
    sheets: {
      [Language.en]: englishSheet,
      [Language.zh]: chineseSheet,
    },
  })

  expect(translate('title')).toBe(spanishSheet.title)
  expect(translate('title', undefined, Language.zh)).toBe(chineseSheet.title)
  expect(translate('title', undefined, Language.en)).toBe(englishSheet.title)
  expect(onLoad).toHaveBeenCalled()
})

test('Available languages can be restricted.', () => {
  globalThis.mockLanguage = 'de_CH'

  const onLoad = mock(() => {})
  const { translate } = create({
    translations: spanishSheet,
    route: '/api/translations',
    onLoad,
    defaultLanguage: Language.es,
    sheets: {
      [Language.en]: englishSheet,
      [Language.zh]: chineseSheet,
      [Language.de]: germanSheet,
    },
    languages: [Language.zh],
  })

  // Falls back to default language, which does not need to be listed.
  expect(translate('title')).toBe(spanishSheet.title)
  // Also falls back as not listed.
  expect(translate('title', undefined, Language.en)).toBe(spanishSheet.title)
  // Language is listed.
  expect(translate('title', undefined, Language.zh)).toBe(chineseSheet.title)
})

test('Language can be changed after initialization.', () => {
  const { translate, setLanguage } = create({
    translations: englishSheet,
    sheets: {
      [Language.en]: englishSheet,
      [Language.zh]: chineseSheet,
    },
  })

  expect(translate('description')).toBe(englishSheet.description)
  setLanguage(Language.zh)
  expect(translate('title')).toBe(chineseSheet.title)
})
