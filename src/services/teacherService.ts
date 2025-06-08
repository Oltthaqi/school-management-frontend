import api from './api'
import type { Teacher } from '../types'

export const teacherService = {
  async getAll(): Promise<Teacher[]> {
    const response = await api.get('/teachers')
    return response.data
  },

  async getById(id: number): Promise<Teacher> {
    const response = await api.get(`/teachers/${id}`)
    return response.data
  },

  async create(teacher: Partial<Teacher>): Promise<Teacher> {
    const response = await api.post('/teachers', teacher)
    return response.data
  },

  async update(id: number, teacher: Partial<Teacher>): Promise<Teacher> {
    const response = await api.put(`/teachers/${id}`, teacher)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/teachers/${id}`)
  }
}