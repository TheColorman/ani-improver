// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const url = 'https://graphql.anilist.co'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
        query ($username: String) {
          User(name:$username) {
            createdAt
            statistics {
              anime {
                statuses {
                  status
                  count
                }
                episodesWatched
                minutesWatched
                meanScore
              }
            }
          }
          SiteStatistics {
            anime(perPage: 1, sort:DATE_DESC) {
              edges {
                node {
                  count
                  date
                }
              }
            }
          }        
        }
      `,
      variables: {
        username: "Colorman",
      }
    })
  })

  const json = await response.json()
  res.status(200).json(json)
}
