import api from './api'
import type { Course } from '../types'

export const courseService = {
  async getAll(): Promise<Course[]> {
    const response = await api.get('/courses')
    return response.data
  },

  async getById(id: number): Promise<Course> {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  async create(course: Partial<Course>): Promise<Course> {
    const response = await api.post('/courses', course)
    return response.data
  },

  async update(id: number, course: Partial<Course>): Promise<Course> {
    const response = await api.put(`/courses/${id}`, course)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/courses/${id}`)
  }
}