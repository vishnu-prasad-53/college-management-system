import { z } from "zod";

export const attendanceSchema = z.object({
    studentId: z.number().int().positive(),
    subjectId: z.number().int().positive(),
    date: z.iso.date(),
    status: z.enum(["present", "absent"]),
});