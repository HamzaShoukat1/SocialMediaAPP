export interface IUser {
  id: string
  name: string
  username: string
  email: string
  imageUrl: string
  bio: string
}

export interface AuthState {
  user: IUser
  isLoading: boolean
  isAuthenticated: boolean
}
