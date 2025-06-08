import api from './api'
import type { Enrollment } from '../types'

export const enrollmentService = {
  async getAll(): Promise<Enrollment[]> {
    const response = await api.get('/enrollments')
    return response.data
  },

  async getById(id: number): Promise<Enrollment> {
    const response = await api.get(`/enrollments/${id}`)
    return response.data
  },

  async create(enrollment: Partial<Enrollment>): Promise<Enrollment> {
    const response = await api.post('/enrollments', enrollment)
    return response.data
  },

  async update(id: number, enrollment: Partial<Enrollment>): Promise<Enrollment> {
    const response = await api.put(`/enrollments/${id}`, enrollment)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/enrollments/${id}`)
  }
}