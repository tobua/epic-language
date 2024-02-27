import { test, expect, beforeEach } from 'bun:test'
import { existsSync, rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { spanishSheet, chineseSheet, germanSheet } from './data'

beforeEach(() => {
  rmSync('test/translation', { recursive: true })
})

test('Bin script creates translated files.', async () => {
  expect(existsSync('translations.json')).toBe(true)
  expect(existsSync('test/translation/de.json')).toBe(false)
  expect(existsSync('dist/bin.js')).toBe(true) // Missing build!
  execSync('bun dist/bin.js --input translations.json --output test/translation --language en', {
    stdio: 'inherit',
  })

  expect(existsSync('test/translation/en.json')).toBe(true)
  expect(existsSync('test/translation/de.json')).toBe(true)
  expect(existsSync('test/translation/es.json')).toBe(true)
  expect(existsSync('test/translation/zh.json')).toBe(true)
  expect(existsSync('test/translation/hi.json')).toBe(true)
  expect(existsSync('test/translation/ko.json')).toBe(true)

  expect((await import('./translation/de.json')).title).toBe(germanSheet.title)
  expect((await import('./translation/de.json')).description).toBeDefined()
  expect((await import('./translation/es.json')).title.toLowerCase()).toBe(
    spanishSheet.title.toLowerCase(),
  )
  expect((await import('./translation/zh.json')).title).toBe(chineseSheet.title)
})

test('Multiple output languages can be defined.', async () => {
  execSync(
    'bun dist/bin.js --input translations.json --output test/translation --language en --languages es,zh',
    {
      stdio: 'inherit',
    },
  )

  expect(existsSync('test/translation/en.json')).toBe(true)
  expect(existsSync('test/translation/de.json')).toBe(false)
  expect(existsSync('test/translation/es.json')).toBe(true)
  expect(existsSync('test/translation/zh.json')).toBe(true)
  expect(existsSync('test/translation/hi.json')).toBe(false)
  expect(existsSync('test/translation/ko.json')).toBe(false)
})

test('Single output language can be defined.', async () => {
  execSync(
    'bun dist/bin.js --input translations.json --output test/translation --language en --languages zh',
    {
      stdio: 'inherit',
    },
  )

  expect(existsSync('test/translation/en.json')).toBe(true)
  expect(existsSync('test/translation/de.json')).toBe(false)
  expect(existsSync('test/translation/es.json')).toBe(false)
  expect(existsSync('test/translation/zh.json')).toBe(true)
  expect(existsSync('test/translation/hi.json')).toBe(false)
  expect(existsSync('test/translation/ko.json')).toBe(false)
})
