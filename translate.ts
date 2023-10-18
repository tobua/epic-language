import OpenAI from 'openai'
import type { Language } from './types'
import { readableLanguage } from './helper'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: 'org-jec41Owv49cySXoL8adosmOh',
})

export async function translate(input: string, language: Language) {
  const prompt = `Translate the following object values to ${readableLanguage[language]} keeping the object keys intact:

${input}`

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    messages: [{ role: 'user', content: prompt }],
  })

  const { choices } = chatCompletion

  if (choices.length === 1) {
    return JSON.parse(choices[0].message.content ?? '{}')
  }

  return {}
}
