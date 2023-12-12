import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  // const { searchParams } = request.nextUrl;
  //   const hasTitle = searchParams.has('lang');
  //   const title = hasTitle
  //     ? searchParams.get('title')?.slice(0, 100)
  //     : 'My default title';

  return response.status(200).send({ title: 'hey' })
}
