import { z } from "zod";

const leaveTypes = [
    "Sick Leave",
    "Casual Leave",
    "Emergency Leave",
    "Medical Leave",
    "Vacation",
    "Other",
] as const;

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createLeaveSchema = z.object({
    leaveType: z.enum(leaveTypes),
    reason: z.string().trim().min(10).max(500),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
}).refine(
    (data) => data.startDate >= today,
    {
        message: "Start date cannot be in the past",
        path: ["startDate"],
    }
).refine(
    (data) => data.endDate >= data.startDate,
    {
        message: "End date must be after or equal to start date",
        path: ["endDate"],
    }
);

export const updateLeaveStatusSchema = z.object({
    status: z.enum(["approved", "rejected"]),
    adminRemarks: z.string().trim().max(500).optional(),
});

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveStatusInput = z.infer<typeof updateLeaveStatusSchema>;