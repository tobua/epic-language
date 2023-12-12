export const config = {
  runtime: 'edge',
}

export default function handler(request: Request) {
  return Response.json({
    name: `Hello, from ${request.url} I'm an Edge Function!`,
  })
}
