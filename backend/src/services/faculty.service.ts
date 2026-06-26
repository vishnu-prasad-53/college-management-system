import { db, faculty } from "../db/index.js";
import { eq } from "drizzle-orm";

export const getFacultyProfile = async (userId: number) => {
    const facultyProfile = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
        with: {
            user: true,
            department: true,
        },
    });

    if(!facultyProfile) {
        throw new Error("Faculty profile not found");
    }

    const { password, ...safeUser } = facultyProfile.user;

    return { ...facultyProfile, user: safeUser };
}

export const updateFacultyProfile = async (userId: number, data: {
    designation?: string;
}) => {
    const facultyProfile = await db.query.faculty.findFirst({
        where: eq(faculty.userId, userId),
    });

    if(!facultyProfile) {
        throw new Error("Faculty profile not found");
    }

    await db.update(faculty).set({
        ...data,
        updatedAt: new Date()}
    ).where(eq(faculty.id, facultyProfile.id));

    return getFacultyProfile(userId);
}