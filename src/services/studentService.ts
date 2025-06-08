import api from './api'
import type { Student } from '../types'

export const studentService = {
  async getAll(): Promise<Student[]> {
    const response = await api.get('/students')
    return response.data
  },

  async getById(id: number): Promise<Student> {
    const response = await api.get(`/students/${id}`)
    return response.data
  },

  async create(student: Partial<Student>): Promise<Student> {
    const response = await api.post('/students', student)
    return response.data
  },

  async update(id: number, student: Partial<Student>): Promise<Student> {
    const response = await api.put(`/students/${id}`, student)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/students/${id}`)
  }
}