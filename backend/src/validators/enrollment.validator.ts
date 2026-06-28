import { z } from "zod";

export const enrollmentSchema = z.object({
    subjectId: z.number().int().positive(),
});