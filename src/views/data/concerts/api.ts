import { request } from '@/utils/api'
import type { ApiResponse, Concert } from '../types'

export const getConcerts = async (): Promise<ApiResponse<Concert[]>> => {
  return request.get<ApiResponse<Concert[]>>('/api/data/concerts')
}

export const saveConcerts = async (concerts: Concert[]): Promise<ApiResponse<Concert[]>> => {
  return request.post<ApiResponse<Concert[]>>('/api/data/concerts', concerts)
}

export const deleteConcert = async (id: string): Promise<void> => {
  return request.delete(`/api/data/concerts/${id}`)
}
