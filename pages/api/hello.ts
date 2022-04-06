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
        query ($id: Int) {
          Media (id: $id, type: ANIME) {
            id
            idMal
            title {
              romaji
              english
              native
              userPreferred
            }
            type
            format
            status
            description
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            season
            seasonYear
            seasonInt
            episodes
            duration
            chapters
            volumes
            countryOfOrigin
            isLicensed
            source
            hashtag
            trailer {
              id
            }
            updatedAt
            coverImage {
              extraLarge
              large
              medium
              color
            }
            bannerImage
            genres
            synonyms
            averageScore
            meanScore
            popularity
            isLocked
            trends {
              edges {
                node {
                  averageScore
                  popularity
                  inProgress
                  episode
                }
              }
            }
            favourites
            tags {
              id
            }
            relations {
              edges {
                id
              }
            }
            characters {
              edges {
                id
              }
            }
            staff {
              edges {
                id
              }
            }
            studios {
              edges {
                id
              }
            }
            isFavourite
            isFavouriteBlocked
            isAdult
            nextAiringEpisode {
              id
            }
            airingSchedule {
              edges {
                id
              }
            }
            trends {
              edges {
                node {
                  averageScore
                  popularity
                  inProgress
                  episode
                }
              }
            }
            externalLinks {
              id
            }
            streamingEpisodes {
              title
              thumbnail
              url
              site
            }
            rankings {
              id
            }
            mediaListEntry {
              id
            }
            reviews {
              edges {
                node {
                  id
                }
              }
            }
            recommendations {
              edges {
                node {
                  id
                }
              }
            }
            stats {
              scoreDistribution {
                score
                amount
              }
              statusDistribution {
                status
                amount
              }
            }
            siteUrl
            autoCreateForumThread
            isRecommendationBlocked
            modNotes
          }
        }
      `,
      variables: {
        id: "1234",
      }
    })
  })

  const json = await response.json()
  res.status(200).json(json)
}
