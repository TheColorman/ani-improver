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

export type ApiUserResponse = ApiError | ApiUser
export type ApiOverviewResponse = ApiError | ApiOverview
export type ApiYourlistsResponse = ApiError | ApiYourlists