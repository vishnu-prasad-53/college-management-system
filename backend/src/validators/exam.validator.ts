import { z } from "zod";

const examTypes = [
    "internal",
    "midterm",
    "end_semester",
    "practical",
    "viva",
] as const;

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createExamSchema = z.object({
    subjectId: z.coerce.number().int().positive(),
    examType: z.enum(examTypes),
    examDate: z.coerce.date(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
    room: z.string().trim().min(1).max(30),
    totalMarks: z.coerce.number().int().min(1).max(1000),
}).refine(
    (data) => data.examDate >= today,
    {
        message: "Exam date cannot be in the past",
        path: ["examDate"],
    }
).refine(
    (data) => data.startTime < data.endTime,
    {
        message: "End time must be after start time",
        path: ["endTime"],
    }
);

export const updateExamSchema = createExamSchema.partial();

export type CreateExamInput = z.infer<typeof createExamSchema>;
export type UpdateExamInput = z.infer<typeof updateExamSchema>;