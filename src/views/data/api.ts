import { request } from '@/utils/api'
import type { ApiResponse, Album } from './types'

export const getAlbums = async (): Promise<ApiResponse<Album[]>> => {
  return request.get<ApiResponse<Album[]>>('/api/data/albums')
}

export const saveAlbums = async (albums: Album[]): Promise<ApiResponse<Album[]>> => {
  return request.post<ApiResponse<Album[]>>('/api/data/albums', albums)
}
