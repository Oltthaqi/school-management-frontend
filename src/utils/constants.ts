import type { Enrollment, Grade, Student, Teacher } from "../types";

export const letterGrades = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "F",
];

export const gradeTableHeader = [
  "Student",
  "Course",
  "Grade",
  "Letter Grade",
  "Graded Date",
  "Comments",
];

export const enrollmentColumns = [
  {
    label: "Student",
    field: "student",
    format: (_: any, e: Enrollment) => `
      <div>
        <p class='font-medium'>${e.student.firstName} ${e.student.lastName}</p>
        <p class='text-sm text-gray-500'>${e.student.studentId}</p>
      </div>
    `,
  },
  {
    label: "Course",
    field: "course",
    format: (_: any, e: Enrollment) => `
      <div>
        <p class='font-medium'>${e.course.courseCode}</p>
        <p class='text-sm text-gray-500'>${e.course.name}</p>
      </div>
    `,
  },
  {
    label: "Enrolled Date",
    field: "enrolledAt",
    format: (val: string) => new Date(val).toLocaleDateString(),
  },
  {
    label: "Status",
    field: "status",
    format: (val: string) => {
      const base =
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
      const style =
        {
          active: "bg-green-100 text-green-800",
          completed: "bg-blue-100 text-blue-800",
          dropped: "bg-red-100 text-red-800",
        }[val.toLowerCase()] || "bg-gray-100 text-gray-800";
      return `<span class='${base} ${style}'>${val}</span>`;
    },
  },
  {
    label: "Grade",
    field: "grade",
    format: (_: any, e: Enrollment) =>
      e.grade
        ? `<span class='font-medium text-green-600'>${e.grade.letterGrade}</span>`
        : `<span class='text-gray-400'>-</span>`,
  },
];

export const gradeColumns = [
  {
    label: "Student",
    field: "student",
    format: (_: any, g: Grade) => g.enrollment?.student?.user?.fullName || "-",
  },
  {
    label: "Course",
    field: "course",
    format: (_: any, g: Grade) => g.enrollment?.course?.name || "-",
  },
  {
    label: "Grade",
    field: "gradeValue",
    format: (value: number) =>
      `<span class='font-semibold text-green-600'>${value}</span>`,
  },
  {
    label: "Letter Grade",
    field: "letterGrade",
    format: (value: string) => {
      const base =
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
      if (!value)
        return `<span class='${base}bg-gray-100 text-gray-800'>-</span>`;
      if (value.startsWith("A"))
        return `<span class='${base}bg-green-100 text-green-800'>${value}</span>`;
      if (value.startsWith("B"))
        return `<span class='${base}bg-blue-100 text-blue-800'>${value}</span>`;
      if (value.startsWith("C"))
        return `<span class='${base}bg-yellow-100 text-yellow-800'>${value}</span>`;
      if (value.startsWith("D"))
        return `<span class='${base}bg-orange-100 text-orange-800'>${value}</span>`;
      return `<span class='${base}bg-red-100 text-red-800'>${value}</span>`;
    },
  },
  {
    label: "Graded Date",
    field: "gradedAt",
    format: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    label: "Comments",
    field: "comments",
    format: (value: string) => value || "-",
  },
];

type Variant = "primary" | "danger" | "secondary";

export const studentColumns = (formatDate: (d?: string) => string) => [
  { label: "Student ID", field: "studentId" },
  {
    label: "Name",
    field: "fullName",
    format: (_: unknown, s: Student) => s.firstName + " " + s.lastName,
  },
  { label: "Email", field: "email" },
  {
    label: "Admission Date",
    field: "admissionDate",
    format: (_: unknown, s: Student) => formatDate(s.admissionDate),
  },
];

export const studentActions = (
  viewStudent: (s: Student) => void,
  editStudent: (s: Student) => void,
  confirmDelete: (s: Student) => void,
  isAdmin: boolean
) => [
  { label: "View", onClick: viewStudent },
  {
    label: "Edit",
    onClick: editStudent,
    show: () => isAdmin,
    variant: "primary" as Variant,
  },
  {
    label: "Delete",
    onClick: confirmDelete,
    show: () => isAdmin,
    variant: "danger" as Variant,
  },
];

export const teacherColumns = [
  { label: "Employee ID", field: "employeeId" },
  {
    label: "Name",
    field: "fullName",
    format: (_: unknown, t: Teacher) => `${t.firstName} ${t.lastName}`,
  },
  { label: "Email", field: "email" },
  { label: "Department", field: "department" },
  {
    label: "Specialization",
    field: "specialization",
    format: (value: string) => value || "N/A",
  },
];

export const teacherActions = (
  viewTeacher: (t: Teacher) => void,
  editTeacher: (t: Teacher) => void,
  confirmDelete: (t: Teacher) => void
) => [
  { label: "View", onClick: viewTeacher },
  {
    label: "Edit",
    onClick: editTeacher,
    variant: "primary" as Variant,
  },
  {
    label: "Delete",
    onClick: confirmDelete,
    variant: "danger" as Variant,
  },
];
