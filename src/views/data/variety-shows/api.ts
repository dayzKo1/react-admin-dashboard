import { request } from '@/utils/api'
import type { ApiResponse, VarietyShow } from '../types'

export const getVarietyShows = async (): Promise<ApiResponse<VarietyShow[]>> => {
  return request.get<ApiResponse<VarietyShow[]>>('/api/data/variety-shows')
}
