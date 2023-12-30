#!/usr/bin/env node
import minimist from 'minimist'
import { existsSync, lstatSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, isAbsolute } from 'path'
import { log } from './helper'
import { Language } from './types'
import { translate } from './translate'

const {
  input,
  output,
  language = Language.en,
  languages = Object.keys(Language),
} = minimist(process.argv.slice(2))
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
  log(`Output folder "${output}" does not exist`, 'error')
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

await Promise.all(translatePromises)
