import { and, eq, gt, isNull, or } from "drizzle-orm";
import { db, notices } from "../db/index.js";
import type { CreateNoticeInput, UpdateNoticeInput } from "../validators/notice.validator.js";

export const createNotice = async (data: CreateNoticeInput) => {
    const [notice] = await db.insert(notices).values({
        title: data.title,
        content: data.content,
        targetRole: data.targetRole,
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split("T")[0] : null,
    }).returning();

    return notice;
};

export const updateNotice = async (noticeId: number, data: UpdateNoticeInput) => {
    const existing = await db.query.notices.findFirst({
        where: eq(notices.id, noticeId),
    });

    if (!existing) {
        throw new Error("Notice not found");
    }

    const [updated] = await db.update(notices).set({
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.targetRole && { targetRole: data.targetRole }),
        ...(data.expiryDate !== undefined && {
            expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split("T")[0] : null,
        }),
    }).where(eq(notices.id, noticeId)).returning();

    return updated;
};

export const deleteNotice = async (noticeId: number) => {
    const existing = await db.query.notices.findFirst({
        where: eq(notices.id, noticeId),
    });

    if (!existing) {
        throw new Error("Notice not found");
    }

    await db.delete(notices).where(eq(notices.id, noticeId));

    return { message: "Notice deleted successfully" };
};

export const getAllNoticesForAdmin = async () => {
    return await db.query.notices.findMany({
        orderBy: (notices, { desc }) => [
            desc(notices.publishedAt),
        ],
    });
};

export const getActiveNotices = async (role: "student" | "faculty") => {
    const today = new Date().toISOString().split("T")[0];

    return await db.query.notices.findMany({
        where: and(
            or(
                eq(notices.targetRole, "all"),
                eq(notices.targetRole, role)
            ),
            or(
                gt(notices.expiryDate, today),
                isNull(notices.expiryDate)
            )
        ),
        orderBy: (notices, { desc }) => [
            desc(notices.publishedAt),
        ],
    });
};