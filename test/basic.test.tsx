import React from 'react'
import { test, expect, mock, spyOn } from 'bun:test'
import { render } from '@testing-library/react'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { Language, translations } from '../index'

const { log } = console // GlobalRegistrator breaks console.log
GlobalRegistrator.register()
console.log = log // Restore log to show up in tests during development.

const windowLanguageSpy = spyOn(window, 'navigator')
windowLanguageSpy.mockImplementation(() => ({ language: 'en_US' }))

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
})

test('Translates key in initially provided language.', () => {
  const onLoad = mock()
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
  const onLoad = mock()
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
