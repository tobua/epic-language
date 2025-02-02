import openAi from 'openai'
import { readableLanguage } from './helper'
import { type Language, Model } from './types'

const openai = new openAi({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
})

export async function translate(input: string, language: Language, model: Model = Model.omni) {
  const chatCompletion = await openai.chat.completions.create({
    model,
    stream: false,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: `Please translate the following object values to ${readableLanguage[language].english}.

${input}`,
      },
      {
        role: 'user',
        content:
          'Note: Please do not translate the object keys. Do not format the JSON within markdown code blocks. Just return the plain JSON.',
      },
    ],
  })

  const { choices } = chatCompletion

  if (choices.length === 1) {
    return JSON.parse(choices[0].message.content ?? '{}')
  }

  return {}
}
