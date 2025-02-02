import { expect, test } from 'bun:test'
import { translate } from '../translate'
import { Language } from '../types'

// Bun automatically reads env variables.

test('Translates single key to various languages.', async () => {
  const inputSheet = JSON.stringify({ title: 'My Title' })
  const sheetSpanish = await translate(inputSheet, Language.es)
  const sheetChinese = await translate(inputSheet, Language.zh)
  const sheetGerman = await translate(inputSheet, Language.de)

  // Casing can vary in Spanish.
  expect(sheetSpanish.title.toLowerCase()).toBe('Mi Título'.toLowerCase())
  expect(sheetChinese.title).toBe('我的标题')
  expect(sheetGerman.title).toBe('Mein Titel')
}, 10000)

test('Translates several to various languages.', async () => {
  const inputSheet = JSON.stringify({ title: 'My Title', description: 'This is the description.' })
  const sheetFrench = await translate(inputSheet, Language.fr)
  const sheetChinese = await translate(inputSheet, Language.zh)
  const sheetGerman = await translate(inputSheet, Language.de)

  expect(sheetFrench.title.toLowerCase()).toBe('Mon titre'.toLowerCase())
  // Ceci est la description. / Voici la description.
  expect(sheetFrench.description).toContain('la description')

  expect(sheetChinese).toEqual({
    title: '我的标题',
    description: '这是描述。',
  })

  expect(sheetGerman.title).toBe('Mein Titel')
  // Das / Dies.
  expect(sheetGerman.description).toContain('ist die Beschreibung.')
}, 20000)

test('Replacement position stays intact.', async () => {
  const inputSheet = JSON.stringify({
    regular: 'first {} second {} third',
    ordered: 'one {2} two {1} three',
  })
  const sheetGerman = await translate(inputSheet, Language.de)

  expect(sheetGerman.regular === 'erstes {} zweites {} drittes' || sheetGerman.regular === 'erste {} zweite {} dritte').toBe(true)
  expect(sheetGerman.ordered).toBe('eins {2} zwei {1} drei')
}, 20000)
