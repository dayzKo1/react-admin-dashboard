import { request } from '@/utils/api'
import type { ApiResponse, Concert } from '../types'

export const getConcerts = async (): Promise<ApiResponse<Concert[]>> => {
  return request.get<ApiResponse<Concert[]>>('/api/data/concerts')
}
