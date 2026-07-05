import { z } from "zod";

export const createAssignmentSubmissionSchema = z.object({
    assignmentId: z.coerce.number().int().positive(),
    submissionText: z.string().trim().max(5000).optional(),
    submissionLink: z.string().trim().url().optional(),
}).refine(
    (data) => data.submissionText || data.submissionLink,
    {
        message: "Provide either submission text or submission link",
        path: ["submissionText"],
    }
);

export const gradeAssignmentSchema = z.object({
    marksObtained: z.coerce.number().int().min(0),
    feedback: z.string().trim().max(2000).optional(),
});

export type CreateAssignmentSubmissionInput = z.infer<typeof createAssignmentSubmissionSchema>;
export type GradeAssignmentInput = z.infer<typeof gradeAssignmentSchema>;