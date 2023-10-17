/// <reference lib="dom" />

import { test, expect, mock, spyOn, beforeAll, afterAll } from 'bun:test'
import { Language, translations } from '../index'

let windowLanguageSpy

beforeAll(() => {
  windowLanguageSpy = spyOn(window, 'navigator')
  // @ts-ignore
  windowLanguageSpy.mockImplementation(() => ({ language: 'en_US' }))
})

afterAll(() => {
  windowLanguageSpy.mockRestore()
})

test('Translates key in initially provided language.', () => {
  const onLoad = mock(() => {})
  const { translate } = translations(
    { title: 'My Title', description: 'This is the description.' },
    '/api/translations',
    onLoad,
    Language.en,
  )

  expect(translate('title')).toBe('My Title')
  expect(translate('description')).toBe('This is the description.')
  // @ts-expect-error
  expect(translate('missing')).toBe('missing')
  expect(onLoad).toHaveBeenCalled()
})

test('Symbols or numbers cannot be used as keys.', () => {
  // TODO doesn't seem possible to restrict keys to string when using generic type with extends.
  const onLoad = mock(() => {})
  const symbol = Symbol('test')
  const { translate } = translations(
    { [symbol]: 'My Symbol', 5: 'My Number' },
    '/api/translations',
    onLoad,
    Language.en,
  )

  expect(translate(symbol)).toBe('My Symbol')
  expect(translate(5)).toBe('My Number')
  // @ts-expect-error
  expect(translate('missing')).toBe('missing')
  expect(onLoad).toHaveBeenCalled()
})

test('Replacements are inserted.', () => {
  const { translate } = translations({ counter: 'Count: {}' }, '/api/translations')

  expect(translate('counter', '123')).toBe('Count: 123')
  expect(translate('counter', 456)).toBe('Count: 456')
})
