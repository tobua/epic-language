# epic-language

<img align="right" src="https://github.com/tobua/epic-language/raw/main/logo.svg" width="30%" alt="Language Logo" />

React translation library built with the Bun 🐰 runtime and Cursor AI 🖱️ editor.

- Built for client-side Serverless architectures on the web
- Supports React Native
- `<Text id="myTranslationKey" />` component to render translations
- Replacements with `{}` in translations
- Translations generated on demand using LLMs (AI)
- Optimized for development phase: no need to commit any translations to source!

## Usage

```ts
import { translations } from 'epic-language'

const { translate } = translations(
  // Initial translations in default language.
  {
    title: 'My Title',
    description: 'This is the description.',
    counter: 'Count: {}',
  },
  // Route to load translations for user language.
  '/api/translations',
  // Callback for when translations have been loaded.
  onLoad,
)

translate('title') // My Title
translate('counter', '5') // Counter: 5
```
