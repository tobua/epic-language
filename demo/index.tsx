import { render, useEffect, useState } from 'epic-jsx'
import { Language, State, create, readableLanguage } from 'epic-language'
import { Button, Exmpl } from 'exmpl'
import { Mode } from './Mode'
import englishSheet from './translations.json'

const mode = sessionStorage.getItem('mode') || 'serverless'

const routeByMode = {
  serverless: 'api/serverless/[language]',
  edge: 'api/edge/[language]',
  static: 'translation/[language].json',
}

const baseUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3001/'

const { translate, Text, language, setLanguage } = create({
  translations: englishSheet,
  route: `${baseUrl}${routeByMode[mode]}`,
  defaultLanguage: Language.en,
})

const InlineCode = ({ children }) => (
  <pre style={{ display: 'inline', background: 'lightgray', padding: 3, borderRadius: 3 }}>{children}</pre>
)

function Translations() {
  const [loading, setLoading] = useState(State.current !== 'ready')
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [count, setCount] = useState(0)

  const timeAndPlace = [
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ]

  useEffect(() => {
    // Check ensures only one call (epic-jsx bug still).
    if (!loading && State.current === 'loading') {
      State.listen((state) => {
        setLoading(state !== 'ready')
      })
    }
  }, [loading])

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {loading ? <p>Loading...</p> : <p>Ready!</p>}
      <div>
        <InlineCode>{`translate('title')`}</InlineCode>: {translate('title')} ({readableLanguage[currentLanguage].flag}{' '}
        {readableLanguage[currentLanguage].english})
      </div>
      <div>
        <InlineCode>{`translate('title', undefined, Language.zh)`}</InlineCode>: {translate('title', undefined, Language.zh)} (
        {readableLanguage[Language.zh].flag} {readableLanguage[Language.zh].english})
      </div>
      <div>
        <InlineCode>{`translate('counter', count)`}</InlineCode>: {translate('counter', count)}
      </div>
      <div>
        <InlineCode>{`translate('time', [...])`}</InlineCode>: {translate('time', timeAndPlace)}
      </div>
      <div>
        <InlineCode>{`<Text>title</Text>`}</InlineCode>: <Text>title</Text>
      </div>
      <div>
        <InlineCode>{`<Text language={currentLanguage}>title</Text>`}</InlineCode>: <Text language={currentLanguage}>title</Text> (
        {readableLanguage[currentLanguage].flag} {readableLanguage[currentLanguage].english})
      </div>
      <div>
        <InlineCode>{`<Text language={Language.zh}>title</Text>`}</InlineCode>: <Text language={Language.zh}>title</Text> (
        {readableLanguage[Language.zh].flag} {readableLanguage[Language.zh].english})
      </div>
      <div>
        <InlineCode>{`<Text language={currentLanguage} replacements={count}>counter</Text>`}</InlineCode>:{' '}
        <Text language={currentLanguage} replacements={count}>
          counter
        </Text>{' '}
        ({readableLanguage[currentLanguage].flag} {readableLanguage[currentLanguage].english})
      </div>
      <div>
        <InlineCode>{`<Text language={currentLanguage} replacements={[...]}>>time</Text>`}</InlineCode>:{' '}
        <Text language={currentLanguage} replacements={timeAndPlace}>
          time
        </Text>{' '}
        ({readableLanguage[currentLanguage].flag} {readableLanguage[currentLanguage].english})
      </div>
      <div>
        <Button onClick={() => setCount(count + 1)}>Increment Counter</Button>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <Mode mode={mode} />
        <select
          value={currentLanguage}
          style={{
            border: '2px solid black',
            borderRadius: 10,
            padding: 5,
          }}
          onChange={(event) => {
            const nextLanguage = event.target.value as Language
            setLanguage(nextLanguage)
            setCurrentLanguage(nextLanguage)
          }}
        >
          {Object.entries(Language).map(([key, language]) => (
            <option key={key} value={key}>
              {readableLanguage[language].flag} {readableLanguage[language].local}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

render(
  <Exmpl title="epic-language Demo" npm="epic-language" github="tobua/epic-language">
    <Translations />
  </Exmpl>,
)
