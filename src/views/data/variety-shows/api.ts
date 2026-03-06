import { request } from '@/utils/api'
import type { ApiResponse, VarietyShow } from '../types'

export const getVarietyShows = async (): Promise<ApiResponse<VarietyShow[]>> => {
  return request.get<ApiResponse<VarietyShow[]>>('/api/data/variety-shows')
}

export const saveVarietyShows = async (shows: VarietyShow[]): Promise<ApiResponse<VarietyShow[]>> => {
  return request.post<ApiResponse<VarietyShow[]>>('/api/data/variety-shows', shows)
}

export const deleteVarietyShow = async (id: string): Promise<void> => {
  return request.delete(`/api/data/variety-shows/${id}`)
}
