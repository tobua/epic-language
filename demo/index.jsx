import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Exmpl } from 'exmpl'
import { create, Language, readableLanguage } from 'epic-language'

const englishSheet = { title: 'My Title!' }

let loaded = false
let onLoad = () => {
  loaded = true
}

const { translate, Text, language, setLanguage } = create({
  translations: englishSheet,
  route: 'http://localhost:3001/api/static/serverless', // '/api/static/serverless',
  onLoad,
  defaultLanguage: Language.en,
})

const InlineCode = ({ children }) => (
  <pre style={{ display: 'inline', background: 'lightgray', padding: 3, borderRadius: 3 }}>
    {children}
  </pre>
)

function Translations() {
  const [loading, setLoading] = useState(!loaded)
  const [currentLanguage, setCurrentLanguage] = useState(language)

  useEffect(() => {
    onLoad = () => setLoading(false)
  }, [loading])

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {loading ? <p>Loading...</p> : <p>Ready!</p>}
      <div>
        <InlineCode>{`translate('title')`}</InlineCode>: {translate('title')} (
        {readableLanguage[currentLanguage].flag} {readableLanguage[currentLanguage].english})
      </div>
      <div>
        <InlineCode>{`translate('title', undefined, Language.zh)`}</InlineCode>:{' '}
        {translate('title', undefined, Language.zh)} ({readableLanguage[Language.zh].flag}{' '}
        {readableLanguage[Language.zh].english})
      </div>
      <div>
        <InlineCode>{`<Text>title</Text>`}</InlineCode>: <Text>title</Text>
      </div>
      <div>
        <InlineCode>{`<Text language={Language.zh}>title</Text>`}</InlineCode>:{' '}
        <Text language={Language.zh}>title</Text>
      </div>
      <select
        value={currentLanguage}
        style={{
          border: '2px solid black',
          borderRadius: 10,
          padding: 5,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
        onChange={(event) => {
          const nextLanguage = event.target.value
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
  )
}

createRoot(document.body).render(
  <Exmpl title="epic-language Demo" npm="epic-language" github="tobua/epic-language">
    <Translations />
  </Exmpl>,
)
