import { z } from "zod";

const audiences = [
    "all",
    "students",
    "faculty",
] as const;

const priorities = [
    "low",
    "normal",
    "high",
    "urgent",
] as const;

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createAnnouncementSchema = z.object({
    title: z.string().trim().min(5).max(200),
    content: z.string().trim().min(10),
    departmentId: z.coerce.number().int().positive().optional(),
    audience: z.enum(audiences),
    priority: z.enum(priorities),
    expiryDate: z.coerce.date().optional(),
}).refine((data) => !data.expiryDate || data.expiryDate >= today,
    {
        message: "Expiry date cannot be in the past",
        path: ["expiryDate"],
    }
);

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;