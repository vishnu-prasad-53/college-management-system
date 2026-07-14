import { z } from "zod";

export const createStudentSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    departmentId: z.number().min(1, "Department is required"),
    usn: z.string().min(5, "USN is required"),
    semester: z.number().min(1, "Semester must be at least 1").max(8, "Semester cannot exceed 8"),
    cgpa: z.number().min(0, "CGPA cannot be negative").max(10, "CGPA cannot exceed 10"),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;