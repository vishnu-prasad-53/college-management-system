import { z } from "zod";

const targetRoles = [
    "all",
    "student",
    "faculty",
] as const;

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createNoticeSchema = z.object({
    title: z.string().trim().min(5).max(150),
    content: z.string().trim().min(10).max(5000),
    targetRole: z.enum(targetRoles).default("all"),
    expiryDate: z.coerce.date().optional(),
}).refine(
    (data) => !data.expiryDate || data.expiryDate >= today,
    {
        message: "Expiry date cannot be in the past",
        path: ["expiryDate"],
    }
);

export const updateNoticeSchema = createNoticeSchema.partial();

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;