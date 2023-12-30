import { test, expect } from 'bun:test'
import { unlinkSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { spanishSheet, chineseSheet, germanSheet } from './data'

const deleteAllFilesExcept = (folderPath: string, fileToKeep: string) => {
  const files = readdirSync(folderPath)

  files.forEach((file) => {
    if (file !== fileToKeep) {
      unlinkSync(join(folderPath, file))
    }
  })
}

test('Bin script creates translated files.', async () => {
  deleteAllFilesExcept('test/files', 'en.json')
  expect(existsSync('test/files/en.json')).toBe(true)
  expect(existsSync('test/files/de.json')).toBe(false)
  expect(existsSync('dist/bin.js')).toBe(true) // Missing build!
  execSync('bun dist/bin.js --input test/files/en.json --output test/files --language en', {
    stdio: 'inherit',
  })

  expect(existsSync('test/files/en.json')).toBe(true)
  expect(existsSync('test/files/de.json')).toBe(true)
  expect(existsSync('test/files/es.json')).toBe(true)
  expect(existsSync('test/files/zh.json')).toBe(true)
  expect(existsSync('test/files/hi.json')).toBe(true)
  expect(existsSync('test/files/ko.json')).toBe(true)

  expect((await import('./files/de.json')).title).toBe(germanSheet.title)
  expect((await import('./files/de.json')).description).toBeDefined()
  expect((await import('./files/es.json')).title.toLowerCase()).toBe(
    spanishSheet.title.toLowerCase(),
  )
  expect((await import('./files/zh.json')).title).toBe(chineseSheet.title)
})

test('Multiple output languages can be defined.', async () => {
  deleteAllFilesExcept('test/files', 'en.json')
  execSync(
    'bun dist/bin.js --input test/files/en.json --output test/files --language en --languages es,zh',
    {
      stdio: 'inherit',
    },
  )

  expect(existsSync('test/files/en.json')).toBe(true)
  expect(existsSync('test/files/de.json')).toBe(false)
  expect(existsSync('test/files/es.json')).toBe(true)
  expect(existsSync('test/files/zh.json')).toBe(true)
  expect(existsSync('test/files/hi.json')).toBe(false)
  expect(existsSync('test/files/ko.json')).toBe(false)
})

test('Single output language can be defined.', async () => {
  deleteAllFilesExcept('test/files', 'en.json')
  execSync(
    'bun dist/bin.js --input test/files/en.json --output test/files --language en --languages zh',
    {
      stdio: 'inherit',
    },
  )

  expect(existsSync('test/files/en.json')).toBe(true)
  expect(existsSync('test/files/de.json')).toBe(false)
  expect(existsSync('test/files/es.json')).toBe(false)
  expect(existsSync('test/files/zh.json')).toBe(true)
  expect(existsSync('test/files/hi.json')).toBe(false)
  expect(existsSync('test/files/ko.json')).toBe(false)
})
