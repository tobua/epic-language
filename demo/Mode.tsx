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
      <option value="serverless-dynamic">Serverless Function Dynamic</option>
      <option value="serverless-static">Serverless Function Static</option>
      <option value="edge-dynamic">Edge Function Dynamic</option>
      <option value="edge-static">Edge Function Static</option>
    </select>
  )
}
