# epic-language

<img align="right" src="https://github.com/tobua/epic-language/raw/main/logo.svg" width="30%" alt="Language Logo" />

React translation library built with the Bun 🐰 runtime, Cursor AI 🖱️ editor and CodeWhisperer 🤫.

- 3 ways to store translations
  - Translated with AI and cached during runtime in a Serverless function
  - Generated with AI during build time and stored in a Serverless function
  - Generated manually or with AI during build and stored in the bundle
- Support for React Native
- `<Text id="myTranslationKey" />` component to render translations
- Replacements with `{}` in translations
- Translations generated on demand using LLMs (AI)
- Optimized for development phase: no need to commit any translations to source!

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
  // Callback for when translations have been loaded.
  onLoad,
})

translate('title') // My Title
translate('counter', '5') // Counter: 5
```

## Usage with Buildtime Translation

```ts
// TODO
```

## Usage with React Native

```tsx
import { create, Language } from 'epic-language/native'

const { translate, Text } = create(
  {
    title: 'My App',
  },
  {
    [Language.es]: { title: 'My App' },
    [Language.zh]: { title: 'My App' },
  },
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
