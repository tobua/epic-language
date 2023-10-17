/// <reference lib="dom" />

import React from 'react'
import { test, expect, mock, spyOn, beforeAll, afterAll } from 'bun:test'
import { render } from '@testing-library/react'
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

test('Can render a basic app.', async () => {
  function Text({ children, ...props }: { children: string }) {
    return <p {...props}>{children.toUpperCase()}</p>
  }
  const app = render(
    <div>
      <Text>first</Text>
      <Text aria-label="translation">second</Text>
    </div>,
  )

  expect(app).toBeDefined()
  expect(app.findByText('FIRST')).toBeDefined()
  expect(app.findByText('SECOND')).toBeDefined()

  const secondByLabel = await app.findByLabelText('translation')

  expect(secondByLabel).toBeDefined()

  app.unmount()
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
