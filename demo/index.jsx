import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Exmpl } from 'exmpl'
import { create, Language } from 'epic-language'

const englishSheet = { title: 'My Title!' }

let loaded = false
let onLoad = () => {
  loaded = true
}

const { translate } = create({
  translations: englishSheet,
  route: '/api/static/serverless',
  onLoad,
  defaultLanguage: Language.en,
})

function Translations() {
  console.log(loaded)
  const [loading, setLoading] = useState(!loaded)

  useEffect(() => {
    onLoad = () => setLoading(false)
  }, [loading])

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>Ready!</p>}
      <p>{translate('title')}</p>
      <p>{translate('title', undefined, Language.zh)}</p>
    </div>
  )
}

createRoot(document.body).render(
  <Exmpl title="epic-language Demo" npm="epic-language" github="tobua/epic-language">
    <Translations />
  </Exmpl>,
)
