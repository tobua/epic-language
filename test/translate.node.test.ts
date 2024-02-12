import { test, expect } from 'bun:test'
import { translate } from '../translate'
import { englishSheet, spanishSheet } from './data'
import { Language } from '../types'

test('Translates key in initially provided language.', async () => {
  const translation = await translate(JSON.stringify(englishSheet), Language.es)
  expect(translation.title.toLowerCase()).toBe(spanishSheet.title.toLowerCase())
})
