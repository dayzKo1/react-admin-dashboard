import { request } from '@/utils/api'
import type { ApiResponse, Team } from '../types'

export const getTeam = async (): Promise<ApiResponse<Team>> => {
  return request.get<ApiResponse<Team>>('/api/data/team')
}

export const saveTeam = async (team: Team): Promise<ApiResponse<Team>> => {
  return request.post<ApiResponse<Team>>('/api/data/team', team)
}
