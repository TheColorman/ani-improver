// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiStats } from '../../types'

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

  console.log("Getting stats from Anilist")
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
        query ($username: String) {
          MediaListCollection(userName: $username, type: ANIME) {
            lists {
              isCustomList
              status
              entries {
                score
                progress
                media {
                  id
                  title {
                    userPreferred
                  }
                  genres
                  tags {
                    name
                    rank
                  }
                  episodes
                  duration
                  coverImage {
                    extraLarge
                  }
                  averageScore
                  meanScore
                  popularity
                  trending
                  favourites
                  staff(sort: RELEVANCE) {
                    pageInfo {
                      total
                      perPage
                      currentPage
                      lastPage
                      hasNextPage
                    }
                    edges {
                      role
                      node {
                        id
                        name {
                          userPreferred
                        }
                        image {
                          large
                        }
                        gender
                        bloodType
                      }
                    }
                  }
                  characters(sort: RELEVANCE) {
                    pageInfo {
                      total
                      currentPage
                      lastPage
                      hasNextPage
                    }
                    edges {
                      node {
                        name {
                          userPreferred
                        }
                        image {
                          large
                        }
                      }
                      voiceActors(language: JAPANESE) {
                        id
                        name {
                          userPreferred
                        }
                        image {
                          large
                        }
                        gender
                        bloodType
                      }
                    }
                  }
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
  const json = await response.json() as { data: ApiStats }
  if (json.data === null) {
    res.status(500).json({ error: 'Anilist API returned null' })
    return
  }

      // This is a very large dataset, so we'll split it up into chunks
  // Remove custom lists and limit data to scored or watched anime
  const lists = json.data.MediaListCollection.lists.filter(list => !list.isCustomList).map(list => {
    const entries = list.entries.filter(entry => entry.score || entry.progress)
    return {
      ...list,
      entries,
    }
  })

  // Directors. Structure: [{ series: id, director: Director }]
  const directors = lists.map(list => {
    return list.entries.filter(entry => entry.media.staff && entry.media.staff.edges.find(edge => edge.role === "Director")).map(entry => {
      const director = entry.media.staff.edges.find(edge => edge.role === "Director")!.node
      return {
        series: entry.media.id,
        director: {
          id: director.id,
          name: director.name.userPreferred,
          image: director.image.large,
          gender: director.gender,
          bloodType: director.bloodType
        }
      }
    })
  }).flat(1)
  // Voice actors. Structure: [{ series: id, voiceActor: [VoiceActor], characterName: string }]
  const voiceActors = lists.map(list => {
    return list.entries.map(entry => {
      return entry.media.characters.edges.filter(edge => edge.voiceActors.length > 0).map(edge => {
        return {
          series: entry.media.id,
          voiceActor: edge.voiceActors[0] ? {
            id: edge.voiceActors[0].id,
            name: edge.voiceActors[0].name.userPreferred,
            image: edge.voiceActors[0].image.large,
            gender: edge.voiceActors[0].gender,
            bloodType: edge.voiceActors[0].bloodType,
          } : null,
          characterName: edge.node.name.userPreferred,
          characterImage: edge.node.image.large
        }
      })
    })
  }).flat(2)
  // Anime. Structure: [Anime]
  const anime = lists.map(list => {
    return list.entries.map(entry => {
      return {
        id: entry.media.id,
        title: entry.media.title.userPreferred,
        genres: entry.media.genres,
        tags: entry.media.tags,
        episodes: entry.media.episodes,
        duration: entry.media.duration,
        image: entry.media.coverImage.extraLarge,
        averageScore: entry.media.averageScore,
        meanScore: entry.media.meanScore,
        popularity: entry.media.popularity,
        trending: entry.media.trending,
        favourites: entry.media.favourites,
        status: list.status,
        score: entry.score,
        progress: entry.progress,
      }
    })
  }).flat(1)

  res.status(200).json({
    anime: anime,
    directors: directors,
    voiceActors: voiceActors,
  })
}
