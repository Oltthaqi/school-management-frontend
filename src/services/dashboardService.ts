import api from "./api";

export const dashboardService = {
  async getTotalStudents(): Promise<number> {
    const response = await api.get("/students/stats/count");
    return response.data;
  },

  async getTotalTeachers(): Promise<number> {
    const response = await api.get("/teachers/stats/count");
    return response.data;
  },
};
