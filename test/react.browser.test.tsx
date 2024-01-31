/// <reference lib="dom" />

import './setup-dom'
import React from 'react'
import { test, expect, beforeEach } from 'bun:test'
import { render } from '@testing-library/react'
import { Language, State, States, create } from '../index'
import { englishSheet } from './data'

beforeEach(() => {
  globalThis.mockLanguage = 'en_US'
})

const serializeDocument = (node: Element = document.body) => {
  const serializer = new XMLSerializer()
  return serializer.serializeToString(node)
}

test('Text component can be used to render translations.', () => {
  const { Text } = create({
    translations: englishSheet,
    route: '/api/translations',
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

  expect(State.current).toBe(States.ready)
  expect(title.textContent).toEqual(englishSheet.title)
  expect(description.textContent).toEqual(englishSheet.description)

  app.unmount()
})

test('Text and JSX can be used as replacements.', () => {
  const { Text } = create({
    translations: {
      regular: 'first {} second {} third',
      ordered: 'one {2} two {1} three',
    },
    route: '/api/translations',
    defaultLanguage: Language.en,
  })

  const app = render(
    <div>
      <Text id="regular" replacements={['123', '456']} />
      <Text replacements={['123', '456']}>ordered</Text>
      <Text id="regular" replacements={[<span>123</span>, <p>456</p>]} />
      <Text replacements={[<p>123</p>, <span>456</span>]}>ordered</Text>
    </div>,
  )

  const serialized = serializeDocument()

  expect(State.current).toBe(States.ready)
  expect(serialized).toContain('first 123 second 456 third')
  expect(serialized).toContain('one 456 two 123 three')
  expect(serialized).toContain('first <span>123</span> second <p>456</p> third')
  expect(serialized).toContain('one <span>456</span> two <p>123</p> three')

  app.unmount()
})
