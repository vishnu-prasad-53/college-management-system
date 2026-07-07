import { z } from "zod";

export const createResultSchema = z.object({
    studentId: z.coerce.number().int().positive(),
    subjectId: z.coerce.number().int().positive(),
    semester: z.coerce.number().int().min(1).max(12),
    internalMarks: z.coerce.number().int().min(0).max(100),
    examMarks: z.coerce.number().int().min(0).max(100),
});

export const updateResultSchema = createResultSchema.partial();

export type CreateResultInput = z.infer<typeof createResultSchema>;
export type UpdateResultInput = z.infer<typeof updateResultSchema>;