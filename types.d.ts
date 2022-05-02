type ApiError = {
  error: string
}

type ApiUser = {
  User: {
    avatar: {
      large: string
      medium: string
    }
    name: string
  } | null
}

type ApiOverview = {
  SiteStatistics: {
    anime: {
      edges: [
        {
          node: {
            count: number
            date: number
          }
        }
      ]
    }
  }
  User: {
    createdAt: number
    statistics: {
      anime: {
        episodesWatched: number
        meanScore: number
        minutesWatched: number
        statuses: [
          {
            count: number
            status: "PLANNING"

          }, {
            count: number
            status: "COMPLETED"

          }, {
            count: number
            status: "DROPPED"

          }, {
            count: number
            status: "CURRENT"

          }
        ]
      }
    }
  }
}

type ApiYourlists = {
  MediaListCollection: {
    lists: [
      {
        entries: [
          {
            completedAt: {
              year: number | null
              month: number | null
              day: number | null
            }
            createdAt: number
            media: {
              averageScore: number
              id: number
              meanScore: number
              popularity: number
              startDate: {
                year: number
                month: number
                day: number
              }
              title: {
                userPreferred: string
              }
              coverImage: {
                large: string
              }
              episodes: number
            }
            progress: number
            score: number
            startedAt: {
              year: number | null
              month: number | null
              day: number | null
            }
            updatedAt: number
          }
        ]
        isCustomList: boolean
        isSplitCompletedList: boolean
        name: string
        status: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | null
      }
    ]
  }
}

type PageInfo = {
  total: number
  currentPage: number
  lastPage: number
  hasNextPage: boolean
}

type ApiStats = {
  MediaListCollection: {
    lists: [
      {
        isCustomList: boolean
        status: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING" | null
        entries: [
          {
            score: number
            progress: number
            media: {
              id: number
              title: {
                userPreferred: string
              }
              genres: string[]
              tags: [
                {
                  name: string
                  rank: number
                }
              ]
              episodes: number | null
              duration: number | null
              coverImage: {
                extraLarge: string
              }
              averageScore: number | null
              meanScore: number | null
              popularity: number
              trending: number
              favourites: number
              staff: {
                pageInfo: PageInfo
                edges: [
                  {
                    role: string
                    node: {
                      id: number
                      name: {
                        userPreferred: string
                      }
                      image: {
                        large: string
                      }
                      gender: "Male" | "Female" | "Non-binary" | string | null
                      bloodType: string | null
                    }
                  }
                ]
              }
              characters: {
                pageInfo: PageInfo
                edges: [
                  {
                    node: {
                      name: {
                        userPreferred: string
                      }
                      image: {
                        large: string
                      }
                    }
                    voiceActors: [
                      {
                        id: number
                        name: {
                          userPreferred: string
                        }
                        gender: "Male" | "Female" | "Non-binary" | string | null
                        image: {
                          large: string
                        },
                        bloodType: string | null
                      }
                    ] | []
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  }
}

type ApiStatsAnime = {
  id: number
  title: string
  genres: string[]
  tags: [
    {
      name: string
      rank: number
    }
  ]
  episodes: number | null
  duration: number | null
  image: string
  averageScore: number | null
  meanScore: number | null
  popularity: number
  trending: number
  favourites: number
  status: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING" | null
  score: number
  progress: number
}

type ApiStatsDirector = {
  series: number
  director: {
    id: number
    name: string
    image: string
    gender: "Male" | "Female" | "Non-binary" | string | null
    bloodType: string | null
  }
}

type ApiStatsVoiceActor = {
  series: number
  voiceActor: {
    id: number
    name: string
    image: string
    gender: "Male" | "Female" | "Non-binary" | string | null
    bloodType: string | null
  }
  characterName: string
  characterImage: string
}

export type ApiUserResponse = ApiError | ApiUser
export type ApiOverviewResponse = ApiError | ApiOverview
export type ApiYourlistsResponse = ApiError | ApiYourlists
export type ApiStatsResponse = ApiError | { anime: ApiStatsAnime[], directors: ApiStatsDirector[], voiceActors: ApiStatsVoiceActor[] }