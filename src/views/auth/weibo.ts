import { request } from '@/utils/api'

export interface WeiboUser {
  id: string
  idstr: string
  screen_name: string
  name: string
  avatar_hd?: string
  avatar_large?: string
  profile_image_url?: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string | number
    username: string
    email: string
    avatar?: string
    weiboId?: string
  }
}

export const loginWithWeibo = async (code: string): Promise<LoginResponse> => {
  return request.post<LoginResponse>('/auth/weibo/login', { code })
}

export const getCurrentUser = async () => {
  return request.get('/auth/user')
}
