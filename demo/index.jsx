import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Exmpl } from 'exmpl'
import { create, Language } from 'epic-language'

const englishSheet = { title: 'My Title!' }

let loaded = false
let onLoad = () => {
  loaded = true
}

const { translate, Text } = create({
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
  console.log(loaded)
  const [loading, setLoading] = useState(!loaded)

  useEffect(() => {
    onLoad = () => setLoading(false)
  }, [loading])

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>Ready!</p>}
      <p>Default Language: {translate('title')}</p>
      <p>Chinese Language: {translate('title', undefined, Language.zh)}</p>
      <p>
        <InlineCode>{`<Text>title</Text>`}</InlineCode>: <Text>title</Text>
      </p>
      <p>
        <InlineCode>{`<Text language={Language.zh}>title</Text>`}</InlineCode>:{' '}
        <Text language={Language.zh}>title</Text>
      </p>
    </div>
  )
}

createRoot(document.body).render(
  <Exmpl title="epic-language Demo" npm="epic-language" github="tobua/epic-language">
    <Translations />
  </Exmpl>,
)
