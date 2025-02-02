import { beforeEach, expect, test } from 'bun:test'
import { execSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { chineseSheet, germanSheet, spanishSheet } from './data'

beforeEach(() => {
  if (existsSync('test/translation')) {
    rmSync('test/translation', { recursive: true })
  }
})

test('Bin script creates translated files.', async () => {
  expect(existsSync('translations.json')).toBe(true)
  expect(existsSync('test/translation/de.json')).toBe(false)
  execSync('bun bin.ts --input translations.json --output test/translation --language en', {
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
  expect((await import('./translation/es.json')).title.toLowerCase()).toBe(spanishSheet.title.toLowerCase())
  expect((await import('./translation/zh.json')).title).toBe(chineseSheet.title)
})

test('Multiple output languages can be defined.', () => {
  execSync('bun bin.ts --input translations.json --output test/translation --language en --languages es,zh', {
    stdio: 'inherit',
  })

  expect(existsSync('test/translation/en.json')).toBe(true)
  expect(existsSync('test/translation/de.json')).toBe(false)
  expect(existsSync('test/translation/es.json')).toBe(true)
  expect(existsSync('test/translation/zh.json')).toBe(true)
  expect(existsSync('test/translation/hi.json')).toBe(false)
  expect(existsSync('test/translation/ko.json')).toBe(false)
})

test('Single output language can be defined.', () => {
  execSync('bun bin.ts --input translations.json --output test/translation --language en --languages zh', {
    stdio: 'inherit',
  })

  expect(existsSync('test/translation/en.json')).toBe(true)
  expect(existsSync('test/translation/de.json')).toBe(false)
  expect(existsSync('test/translation/es.json')).toBe(false)
  expect(existsSync('test/translation/zh.json')).toBe(true)
  expect(existsSync('test/translation/hi.json')).toBe(false)
  expect(existsSync('test/translation/ko.json')).toBe(false)
})
