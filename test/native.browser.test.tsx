/// <reference lib="dom" />

import './setup-dom'
import React from 'react'
import { test, expect, beforeEach } from 'bun:test'
import { render } from '@testing-library/react'
import { Language, create } from '../native'
import { englishSheet, spanishSheet, chineseSheet } from './data'

beforeEach(() => {
  global.mockLanguage = 'en_US'
})

test('Translates key in initially provided language.', () => {
  const { translate } = create(
    englishSheet,
    { [Language.en]: englishSheet, [Language.es]: spanishSheet, [Language.zh]: chineseSheet },
    Language.en,
  )

  expect(translate('title')).toBe(englishSheet.title)
  expect(translate('description')).toBe(englishSheet.description)
  // @ts-expect-error
  expect(translate('missing')).toBe('missing')
})

test('Warning if any sheets are missing keys.', () => {
  const { translate } = create(
    englishSheet,
    {
      [Language.en]: englishSheet,
      // @ts-expect-error
      [Language.es]: { title: 'hey' },
      // @ts-expect-error
      [Language.zh]: { description: 'hey' },
    },
    Language.en,
  )

  expect(translate('title', undefined, Language.zh)).toBe('title')
  expect(translate('description', undefined, Language.es)).toBe('description')
})

test('Translates key in initially provided language.', () => {
  const { translate } = create(
    englishSheet,
    { [Language.en]: englishSheet, [Language.es]: spanishSheet, [Language.zh]: chineseSheet },
    Language.en,
  )

  expect(translate('title')).toBe(englishSheet.title)
  expect(translate('description')).toBe(englishSheet.description)
  // @ts-expect-error
  expect(translate('missing')).toBe('missing')
})

test('Translates key in initially provided language.', () => {
  const { Text } = create(
    englishSheet,
    { [Language.en]: englishSheet, [Language.es]: spanishSheet, [Language.zh]: chineseSheet },
    Language.en,
  )

  const app = render(
    <div>
      <Text data-testid="title" id="title" />
      <Text data-testid="description">description</Text>
      {/* @ts-expect-error */}
      <Text data-testid="missing" id="missing" />
    </div>,
  )

  const title = app.getByTestId('title')
  const description = app.getByTestId('description')

  expect(title.textContent).toEqual(englishSheet.title)
  expect(description.textContent).toEqual(englishSheet.description)

  app.unmount()
})
