/// <reference lib="dom" />

import './setup-dom'
import React from 'react'
import { test, expect, mock, beforeAll } from 'bun:test'
import { render } from '@testing-library/react'
import { Language, translations } from '../index'

beforeAll(() => {
  global.mockLanguage = 'en_US'
})

test('Text component can be used to render translations.', () => {
  const onLoad = mock(() => {})
  const { Text } = translations(
    { title: 'My Title', description: 'This is the description.' },
    '/api/translations',
    onLoad,
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

  expect(onLoad).toHaveBeenCalled()
  expect(title.textContent).toEqual('My Title')
  expect(description.textContent).toEqual('This is the description.')

  app.unmount()
})
