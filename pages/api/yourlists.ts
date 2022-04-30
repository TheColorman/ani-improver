// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const url = 'https://graphql.anilist.co'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = req.query.username as string | undefined
  if (!username) {
    res.status(400).json({ error: 'username is required' })
    return
  }

  console.log("Getting data from Anilist");

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
        query ($username: String) {
          MediaListCollection(userName:$username, type:ANIME) {
            lists {
              name
              isCustomList
              isSplitCompletedList
              status
              entries {
                media {
                  id
                  title {
                    userPreferred
                  }
                  startDate {
                    year
                    month
                    day
                  }
                  averageScore
                  meanScore
                  popularity
                  coverImage {
                    large
                  }
                  episodes
                }
                score
                progress
                updatedAt
                createdAt
                startedAt {
                  year
                  month
                  day
                }
                completedAt {
                  year
                  month
                  day
                }
              }
            }
          }
        }
      `,
      variables: {
        username: username,
      }
    })
  })

  const json = await response.json()
  console.log(json);
  res.status(200).json(json.data)
}
