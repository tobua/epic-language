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

This project was built to try the Bun 🐰 runtime, Cursor AI 🖱️ editor and CodeWhisperer 🤫.

## Usage with Buildtime Translation

This is the most basic method where all translations are bundled into the main JavaScript bundle. This is useful for development, when supporting only few languages or when distributing as a package like React Native apps. To use this method, create a main JSON file in the default language containing the initial translations. The CLI translation script can then be used to translate these keys during installation or the build.

```sh
npx epic-language --input translations/en.json --output translations --language en --languages es,zh
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

## Usage with Runtime Translation and Caching

```ts
import { create } from 'epic-language'

const { translate } = create({
  // Initial translations in default language.
  translations: {
    title: 'My Title',
    description: 'This is the description.',
    counter: 'Count: {}',
  },
  // Route to load translations for user language.
  route: '/api/translations',
})

translate('title') // My Title
translate('counter', '5') // Counter: 5
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
