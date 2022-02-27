// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'
import type { FormInput } from 'typings'

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: '2021-10-21',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
}
const client = sanityClient(config)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { _id, name, email, comment }: FormInput = JSON.parse(req.body)

    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment,
    })
  } catch (error) {
    res.status(500).json({ message: 'Could not submit comment', error })
  }

  res.status(200).json({ message: 'Comment Submitted' })
}
