import { z } from "zod";

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createTimetableSchema = z.object({
    departmentId: z.number().int().positive(),
    subjectId: z.number().int().positive(),
    facultyId: z.number().int().positive(),
    semester: z.number().int().min(1).max(8),
    dayOfWeek: z.enum(days),
    startTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
    endTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
    roomNumber: z.string().trim().min(1).max(20),
}).refine(
    (data) => data.startTime < data.endTime,
    {
        message: "End time must be after start time",
        path: ["endTime"],
    }
);

export const updateTimetableSchema = createTimetableSchema.partial();

export type CreateTimetableInput = z.infer<typeof createTimetableSchema>;
export type UpdateTimetableInput = z.infer<typeof updateTimetableSchema>;