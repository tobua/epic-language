/// <reference lib="dom" />

import './setup-dom'
import { test, expect, beforeEach } from 'bun:test'
import { Language, State, States, create } from '../index'
import { englishSheet, spanishSheet, chineseSheet, germanSheet } from './data'

beforeEach(() => {
  globalThis.mockLanguage = 'en_US'
})

test('Translates key in initially provided language.', () => {
  const { translate } = create({
    translations: englishSheet,
    route: '/api/translations/[language]',
    defaultLanguage: Language.en,
  })

  expect(translate('title')).toBe(englishSheet.title)
  expect(translate('description')).toBe(englishSheet.description)
  // @ts-expect-error
  expect(translate('missing')).toBe('missing')
  expect(State.current).toBe(States.ready)
})

test('Symbols or numbers cannot be used as keys.', () => {
  // TODO doesn't seem possible to restrict keys to string when using generic type with extends.
  const symbol = Symbol('test')
  const { translate } = create({
    translations: { [symbol]: 'My Symbol', 5: 'My Number' },
    route: '/api/translations/[language]',
    defaultLanguage: Language.en,
  })

  expect(translate(symbol)).toBe('My Symbol')
  expect(translate(5)).toBe('My Number')
  // @ts-expect-error
  expect(translate('missing')).toBe('missing')
  expect(State.current).toBe(States.ready)
})

test('Replacements are inserted.', () => {
  const { translate } = create({
    translations: { counter: 'Count: {}', multiple: 'First: {} Second: {}' },
    route: '/api/translations/[language]',
  })

  expect(translate('counter', '123')).toBe('Count: 123')
  expect(translate('counter', 456)).toBe('Count: 456')
  expect(translate('counter', 'spaced@ _$')).toBe('Count: spaced@ _$')
  expect(translate('multiple', ['123', '456'])).toBe('First: 123 Second: 456')
  expect(translate('counter', 0)).toBe('Count: 0')
  expect(translate('counter', [0])).toBe('Count: 0')
})

test('Replacements can be numbered.', () => {
  const { translate } = create({
    translations: {
      one: 'a {1} b',
      two: 'a {1} b {2} c',
      reverse: 'a {2} b {1} c',
      unordered: 'a {2} b {1} c {3} d',
      multipleOrderedReplacements: "What's {2} current {1}?",
    },
    route: '/api/translations/[language]',
  })

  expect(translate('one', '1')).toBe('a 1 b')
  expect(translate('two', [1, 2])).toBe('a 1 b 2 c')
  expect(translate('reverse', [1, 2])).toBe('a 2 b 1 c')
  expect(translate('unordered', [1, 2, 3])).toBe('a 2 b 1 c 3 d')
  expect(translate('multipleOrderedReplacements', ['pastime', 'your'])).toBe(
    "What's your current pastime?",
  )
})

test('Multiple sheets can be provided initially.', () => {
  globalThis.mockLanguage = 'es-ES'

  const { translate } = create({
    translations: spanishSheet,
    route: '/api/translations/[language]',
    defaultLanguage: Language.es,
    sheets: {
      [Language.en]: englishSheet,
      [Language.zh]: chineseSheet,
    },
  })

  expect(translate('title')).toBe(spanishSheet.title)
  expect(translate('title', undefined, Language.zh)).toBe(chineseSheet.title)
  expect(translate('title', undefined, Language.en)).toBe(englishSheet.title)
  expect(State.current).toBe(States.ready)
})

test('Available languages can be restricted.', () => {
  globalThis.mockLanguage = 'de_CH'

  const { translate } = create({
    translations: spanishSheet,
    route: '/api/translations/[language]',
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
