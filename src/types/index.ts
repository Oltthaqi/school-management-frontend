export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  dateOfBirth?: string;
  admissionDate?: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: string;
  phoneNumber?: string;
  specialization?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  courseCode: string;
  name: string;
  description?: string;
  creditHours?: number;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
    employeeId: string;
    department: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  course: {
    id: number;
    courseCode: string;
    name: string;
    creditHours?: number;
  };
  enrolledAt: string;
  status: string;
  grade?: Grade;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentRequest {
  studentId: number;
  courseId: number;
  status?: string;
}

// types.ts
export interface Grade {
  id: number;
  enrollmentId: number;
  gradeValue: number;
  letterGrade?: string;
  gradedAt: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
  enrollment?: {
    student: {
      studentId: string;
      firstName: string;
      lastName: string;
      user: {
        id: number;
        fullName: string;
      };
    };
    course: {
      id: number;
      courseCode: string;
      name: string;
    };
  };
}

export interface Admission {
  id: number;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  applicationNumber: string;
  status: string;
  appliedAt: string;
  decisionAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
