#!/usr/bin/env bun
import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import minimist from 'minimist'
import { log } from './helper'
import { translate } from './translate'
import { Language } from './types'

const { input, output, language = Language.en, languages = Object.keys(Language) } = minimist(process.argv.slice(2))
let fullInputPath = isAbsolute(input) ? input : join(process.cwd(), input)
let fullOutputPath = isAbsolute(output) ? output : join(process.cwd(), output)

const parsedLanguages = Array.isArray(languages) ? languages : languages.split(',')

if (!existsSync(fullInputPath)) {
  log(`Input file "${input}" does not exist`, 'error')
}

// Check if input is a folder and add en.json in this case
if (lstatSync(fullInputPath).isDirectory()) {
  fullInputPath = join(fullInputPath, 'en.json')
}

if (!output) {
  fullOutputPath = dirname(input)
}

if (!existsSync(fullOutputPath)) {
  log(`Creating output folder "${output}"`, 'warning')
  mkdirSync(fullOutputPath)
}

if (!lstatSync(fullOutputPath).isDirectory()) {
  log(`Output "${output}" must be a directory`, 'error')
}

if (!(language in Language)) {
  log(`Invalid language "${language}" passed`, 'error')
}
// Remove input language.
if (parsedLanguages.includes(language)) {
  parsedLanguages.splice(parsedLanguages.indexOf(language), 1)
}

const inputSheetContents = readFileSync(fullInputPath, 'utf8')
const inputSheet = JSON.parse(inputSheetContents)

const translatePromises = parsedLanguages.map(async (currentLanguage: Language) => {
  const sheet = await translate(JSON.stringify(inputSheet), currentLanguage)
  writeFileSync(join(fullOutputPath, `${currentLanguage}.json`), JSON.stringify(sheet, null, 2), {
    flag: 'w', // Override existing file.
  })
})

// Also create input language file.
writeFileSync(join(fullOutputPath, `${language}.json`), inputSheetContents, {
  flag: 'w', // Override existing file.
})

await Promise.all(translatePromises)
