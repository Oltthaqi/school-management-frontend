export interface RecentEnrollment {
  studentName: string;
  courseName: string;
  when: string;
}

export interface RecentGrade {
  studentName: string;
  courseName: string;
  grade: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  recentEnrollments: RecentEnrollment[];
  recentGrades: RecentGrade[];
}
