import { eq } from "drizzle-orm";
import { db, faculty, leaveRequests } from "../db/index.js";
import type { CreateLeaveInput, UpdateLeaveStatusInput } from "../validators/leave.validator.js";

export const createLeaveRequest = async (userId: number, data: CreateLeaveInput) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    const [leave] = await db.insert(leaveRequests).values({
        facultyId: facultyMember.id,
        leaveType: data.leaveType,
        reason: data.reason,
        startDate: data.startDate.toISOString().split("T")[0],
        endDate: data.endDate.toISOString().split("T")[0],
    }).returning();

    return leave;
};

export const getMyLeaveRequests = async (userId: number) => {
    const facultyMember = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if (!facultyMember) {
        throw new Error("Faculty not found");
    }

    return await db.query.leaveRequests.findMany({
        where: eq(leaveRequests.facultyId, facultyMember.id),
        orderBy: (leaveRequests, { desc }) => [
            desc(leaveRequests.createdAt),
        ],
    });
};

export const getAllLeaveRequests = async () => {
    const requests = await db.query.leaveRequests.findMany({
        with: {
            faculty: {
                with: {
                    user: true,
                    department: true,
                },
            },
        },
        orderBy: (leaveRequests, { desc }) => [
            desc(leaveRequests.createdAt),
        ],
    });

    return requests.map((request) => {
        const { password, ...safeUser } = request.faculty.user;

        return {
            ...request,
            faculty: {
                ...request.faculty,
                user: safeUser,
            },
        };
    });
};

export const updateLeaveStatus = async (leaveId: number, data: UpdateLeaveStatusInput) => {
    const existing = await db.query.leaveRequests.findFirst({
        where: eq(leaveRequests.id, leaveId),
    });

    if (!existing) {
        throw new Error("Leave request not found");
    }

    const [updated] = await db.update(leaveRequests).set({
        status: data.status,adminRemarks: data.adminRemarks,
    }).where(eq(leaveRequests.id, leaveId)).returning();

    return updated;
};

export const deleteLeaveRequest = async (leaveId: number) => {
    const existing = await db.query.leaveRequests.findFirst({
        where: eq(leaveRequests.id, leaveId),
    });

    if (!existing) {
        throw new Error("Leave request not found");
    }

    await db.delete(leaveRequests).where(eq(leaveRequests.id, leaveId));

    return { message: "Leave request deleted successfully" };
};