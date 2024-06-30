# epic-language

<img align="right" src="https://github.com/tobua/epic-language/raw/main/logo.svg" width="30%" alt="Language Logo" />

AI-assisted translation library for React and React Native.

- 3 ways to store translations
  - **Bundled** Generated manually or with AI during build and stored in the bundle
  - **CDN** Generated with AI during build time and stored in a Serverless function
  - **Serverless** Translated with AI and cached during runtime in a Serverless function
- Support for React Native
- `<Text id="myTranslationKey" />` component to render translations
- Replacements with `{}` or `{1} {2}` in translations
- Translations generated on demand using LLMs (AI)
- Optimized for development phase: no need to commit any translations to source!

This project was built to try the Bun 🐰 runtime, Cursor AI 🖱️ editor and CodeWhisperer 🤫. See [this blog post](https://onwebfocus.com/bun) detailing my experiences.

## Usage with Buildtime Translation

This is the most basic method where all translations are bundled into the main JavaScript bundle. This is useful for development, when supporting only few languages or when distributing as a package like React Native apps. To use this method, create a main JSON file in the default language containing the initial translations. The CLI translation script can then be used to translate these keys during installation or the build. Running this will require `OPENAI_API_KEY` and `OPENAI_ORGANIZATION` (optional) environment variables to be present. These variables will automatically be loaded from your `.env` file thanks to Bun.

```sh
bunx epic-language --input translations.json --output translations --language en --languages es,zh
```

Once generated the translation files can be imported as JSON and bundled directly into JavaScript.

```ts
import { create, Language } from 'epic-language'
import spanishSheet from './translations/es.json'
import chineseSheet from './translations/zh.json'

const { translate } = create({
  // Initial translations in default language.
  translations: {
    title: 'My Title',
    replacement: 'Counter: {}',
    multipleOrderedReplacements: "What's {2} current {1}?",
  },
  // Additional translated language sheets.
  sheets: {
    [Language.es]: spanishSheet,
    [Language.zh]: chineseSheet,
  },
})

translate('title') // My Title
translate('replacement', 5) // Counter: 5
translate('multipleOrderedReplacements', ['pastime', 'your']) // What's your current pastime?
```

### Individual Translations Served As Static Files

To avoid bundling translations with your regular JavaScript code and only send the required translations to the user you can configure a static route. In most build tools assets from the `/public` folder will be served statically.

```sh
bunx epic-language --input translations.json --output public/translation --language en --languages es,zh
```

```ts
import { create, Language } from 'epic-language'
// Always load the translations for the default language.
import translations from './translations.json'

const { translate } = create({
  // Initial translations in default language.
  translations,
  // Translation files served statically as JSON files per language.
  // [language] will be replaced with the language (en, es, zh etc.)
  route: 'translation/[language].json',
})

translate('title') // My Title
```

## Usage with Runtime Translation and Caching

The route can point to a Serverless or Edge API function that will generate and cache the desired translations. This avoids translating every language during the build and will save a lot of time during the development phase, while ensuring translations always work.

```ts
import { create } from 'epic-language'
import translations from './translations.json'

const { translate } = create({
  // Initial translations in default language.
  translations,
  // Route to load translations for user language.
  // [language] will be replaced with the language (en, es, zh etc.)
  route: '/api/translation/[language]',
})

translate('title') // My Title
translate('counter', '5') // Counter: 5
```

The following functions have been tested on Vercel and can be adapted accordingly for other hosting providers. It's important to make sure the `OPENAI_API_KEY` and `OPENAI_ORGANIZATION` (optional) environment variables are available in your functions. Check out the [`/api` source code](https://github.com/tobua/epic-language/tree/main/demo/api) of the demo application.

### Serverless Function

```ts
import { readFileSync } from 'fs'
import { it } from 'avait'
import { Language } from 'epic-language'
import { translate } from 'epic-language/function'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const language = request.query.lang as Language
  if (!(language in Language))
    return response.status(500).json({ error: `Missing language "${language}"` })
  const englishSheet = JSON.parse(
    readFileSync(new URL('../../translations.json', import.meta.url), 'utf8'),
  )
  const { error, value: sheet } = await it(translate(JSON.stringify(englishSheet), language))
  if (error)
    return response.status(500).json({ error: `Translation for language "${language}" failed!` })
  response.status(200).json(sheet)
}
```

### Edge Function

```ts
import { it } from 'avait'
import { Language } from 'epic-language'
import { translate } from 'epic-language/function'
import translations from '../../translations.json'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const language = searchParams.get('lang') as Language
  if (!(language in Language)) return new Response(`Missing language "${language}"`)
  const { error, value: sheet } = await it(translate(JSON.stringify(translations), language))
  if (error) return new Response(`Translation for language "${language}" failed!`)
  return Response.json(sheet)
}
```

## Usage with React Native

```tsx
import { create, Language } from 'epic-language/native'

const { translate, Text } = create(
  // Default translations.
  { title: 'My App' },
  // Translations in additional languages.
  {
    [Language.es]: { title: 'Mi aplicación' },
    [Language.zh]: { title: '我的應用程式' },
  },
  // Language, defaults to english.
  Language.en,
)

const settingsText = translate('title')
const Heading = <Text style={{ fontSize: 32 }}>title</Text>
```

ES Module exports are still an experimental feature in React Native's Metro bundler. Since this plugin requires them you have to turn them in your `metro.config.js` with:

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const config = {
  resolver: {
    unstable_enablePackageExports: true,
  },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
```

## Advanced Usage

The `State` object allows you to keep track of the status for loading language sheets.

```tsx
import { create, State } from 'epic-language'

const { translate } = create({ translations: { title: 'My Title' } })

State.current === 'ready' // Current state: initial, loading or ready.
State.listen((state, language) => console.log(state, language)) // Listen to state changes.
State.languages // List of all available translated languages.
```

It's also possible to insert `JSX.Element` as replacements.

```tsx
import { create } from 'epic-language'

const { translate } = create({ translations: { counter: 'Count {} at {}' } })

translate(counter, [<span>5</span>, <div style={{ color: 'red' }}>{`12:34 PM`}</div>]) // Count <span>5</span> at <div>12:34 PM</div>
```
