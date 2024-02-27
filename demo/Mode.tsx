export function Mode({ mode }: { mode: string }) {
  return (
    <select
      value={mode}
      style={{
        border: '2px solid black',
        borderRadius: 10,
        padding: 5,
      }}
      onChange={(event) => {
        sessionStorage.setItem('mode', event.target.value)
        window.location.reload()
      }}
    >
      <option value="serverless">Serverless Function</option>
      <option value="edge">Edge Function</option>
      <option value="static">Static Assets</option>
    </select>
  )
}
