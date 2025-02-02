import { expect, test } from 'bun:test'
import { translate } from '../translate'
import { Language } from '../types'
import { englishSheet, spanishSheet } from './data'

test('Translates key in initially provided language.', async () => {
  const translation = await translate(JSON.stringify(englishSheet), Language.es)
  expect(translation.title.toLowerCase()).toBe(spanishSheet.title.toLowerCase())
})
