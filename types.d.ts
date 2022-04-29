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

export type ApiUserResponse = ApiError | ApiUser