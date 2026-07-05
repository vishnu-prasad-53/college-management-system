import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createAssignmentSchema = z.object({
    subjectId: z.coerce.number().int().positive(),
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(150, "Title cannot exceed 150 characters"),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(5000, "Description cannot exceed 5000 characters"),
    dueDate: z.coerce.date(),
    maxMarks: z.coerce.number().int().min(1, "Maximum marks must be at least 1").max(1000, "Maximum marks cannot exceed 1000"),
}).refine(
    (data) => data.dueDate >= today,
    {
        message: "Due date cannot be in the past",
        path: ["dueDate"],
    }
);

export const updateAssignmentSchema = createAssignmentSchema.partial();

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;