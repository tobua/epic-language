// import { Language } from 'epic-language'

export const config = {
  runtime: 'edge',
}

console.log('HEY')

export default function handler(request: Request) {
  console.log('TEST')
  // const { lang = Language.en } = request.params || request.query // params for express and query for serverless
  return Response.json({
    title: 'Title',
    // lang,
  })
}
