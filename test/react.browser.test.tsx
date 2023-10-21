/// <reference lib="dom" />

import './setup-dom'
import React from 'react'
import { test, expect, mock, beforeEach } from 'bun:test'
import { render } from '@testing-library/react'
import { Language, create } from '../index'
import { englishSheet } from './data'

beforeEach(() => {
  global.mockLanguage = 'en_US'
})

test('Text component can be used to render translations.', () => {
  const onLoad = mock(() => {})
  const { Text } = create({
    translations: englishSheet,
    route: '/api/translations',
    onLoad,
    defaultLanguage: Language.en,
  })

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

  expect(onLoad).toHaveBeenCalled()
  expect(title.textContent).toEqual(englishSheet.title)
  expect(description.textContent).toEqual(englishSheet.description)

  app.unmount()
})
