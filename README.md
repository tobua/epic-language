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

For compatibility reasons the following `package.json` entries are required. The first entry adds package exports support to metro while the second downgrades [`chalk`](https://npmjs.com/chalk) to a version that does not yet require package imports.

```json
{
  "metro": {
    "resolver": {
      "unstable_enablePackageExports": true
    }
  },
  "overrides": {
    "chalk": "^4.1.2"
  }
}
```
