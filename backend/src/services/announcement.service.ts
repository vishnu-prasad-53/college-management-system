import { and, eq, isNull, gte, or } from "drizzle-orm";

import { db, announcements, users } from "../db/index.js";

import type { CreateAnnouncementInput, UpdateAnnouncementInput } from "../validators/announcement.validator.js";

export const createAnnouncement = async (userId: number, data: CreateAnnouncementInput) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        throw new Error("User not found");
    }

    const [announcement] = await db.insert(announcements).values({
            title: data.title,
            content: data.content,
            postedBy: userId,
            departmentId: data.departmentId,
            audience: data.audience,
            priority: data.priority,
            expiryDate: data.expiryDate ? data.expiryDate instanceof Date ? data.expiryDate.toISOString().split("T")[0] : data.expiryDate : null
        }).returning();

    return announcement;
};

export const updateAnnouncement = async (announcementId: number, userId: number, data: UpdateAnnouncementInput) => {
    const existing = await db.query.announcements.findFirst({
        where: eq(announcements.id, announcementId),
    });

    if (!existing) {
        throw new Error("Announcement not found");
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "admin" && existing.postedBy !== userId) {
        throw new Error("You can update only your announcements");
    }

    const [updated] = await db.update(announcements).set({
            ...(data.title && { title: data.title }),
            ...(data.content && { content: data.content }),
            ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
            ...(data.audience && { audience: data.audience }),
            ...(data.priority && { priority: data.priority }),
            ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate ? data.expiryDate instanceof Date ? data.expiryDate.toISOString().split("T")[0] : data.expiryDate : null }),
        }).where(eq(announcements.id, announcementId)).returning();

    return updated;
};

export const deleteAnnouncement = async (announcementId: number, userId: number) => {
    const existing = await db.query.announcements.findFirst({
        where: eq(announcements.id, announcementId),
    });

    if (!existing) {
        throw new Error("Announcement not found");
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "admin" && existing.postedBy !== userId) {
        throw new Error("You can delete only your announcements");
    }

    await db.delete(announcements).where(eq(announcements.id, announcementId));

    return {
        message: "Announcement deleted successfully",
    };
};

export const getMyAnnouncements = async (userId: number) => {
    return await db.query.announcements.findMany({
        where: eq(announcements.postedBy, userId),
        with: {
            user: true,
            department: true,
        },
        orderBy: (announcements, { desc }) => [
            desc(announcements.createdAt),
        ],
    });
};

export const getAllAnnouncements = async () => {
    const today = new Date().toISOString().split("T")[0];

    const records = await db.query.announcements.findMany({
        where: or(
            isNull(announcements.expiryDate),
            gte(announcements.expiryDate, today)
        ),
        with: {
            user: true,
            department: true,
        },
        orderBy: (announcements, { desc }) => [
            desc(announcements.createdAt),
        ],
    });

    return records.map((record) => {
        const { password, ...safeUser } = record.user;

        return {
            ...record,
            user: safeUser,
        };
    });
};

export const getAnnouncementById = async (announcementId: number) => {
    const announcement = await db.query.announcements.findFirst({
            where: and(
                eq(announcements.id, announcementId),
                or(
                    isNull(announcements.expiryDate),
                    gte(
                        announcements.expiryDate,
                        new Date().toISOString().split("T")[0]
                    )
                )
            ),
            with: {
                user: true,
                department: true,
            },
        });

    if (!announcement) {
        throw new Error("Announcement not found");
    }

    const { password, ...safeUser } = announcement.user;

    return { ...announcement, user: safeUser };
};