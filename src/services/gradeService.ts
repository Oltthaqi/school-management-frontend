import api from './api'
import type { Grade } from '../types'

export const gradeService = {
  async getAll(): Promise<Grade[]> {
    const response = await api.get('/grades')
    return response.data
  },

  async getById(id: number): Promise<Grade> {
    const response = await api.get(`/grades/${id}`)
    return response.data
  },

  async create(grade: Partial<Grade>): Promise<Grade> {
    const response = await api.post('/grades', grade)
    return response.data
  },

  async update(id: number, grade: Partial<Grade>): Promise<Grade> {
    const response = await api.put(`/grades/${id}`, grade)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/grades/${id}`)
  }
}