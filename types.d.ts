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
            status: {
              count: number
              status: "PLANNING"
            }
          }, {
            status: {
              count: number
              status: "COMPLETED"
            }
          }, {
            status: {
              count: number
              status: "DROPPED"
            }
          }, {
            status: {
              count: number
              status: "CURRENT"
            }
          }
        ]
      }
    }
  }
}

export type ApiUserResponse = ApiError | ApiUser
export type ApiOverviewResponse = ApiError | ApiOverview