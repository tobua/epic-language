import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Exmpl } from 'exmpl'

function Count() {
  const [max, setMax] = useState(5)
  const [count, setCount] = useState('loading')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/count/${max}`)
        const result = await response.json()
        setCount(result.count)
      } catch (error) {
        setCount('error')
      }
    }
    fetchData()
  }, [max])

  return (
    <div>
      <p>
        Number from server between 0 and {max} (maximum): <strong>{count}</strong>
      </p>
      <p>
        Set maximum:{' '}
        <input
          placeholder="Maximum"
          type="number"
          min="0"
          max="999"
          value={max}
          required
          onChange={(event) => setMax(event.target.value)}
        />
      </p>
    </div>
  )
}

createRoot(document.body).render(
  <Exmpl title="epic-language Demo" npm="epic-language" github="tobua/epic-language">
    <Count />
  </Exmpl>,
)
