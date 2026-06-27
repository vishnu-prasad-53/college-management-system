import { db, subjects } from "../db/index.js";
import { eq } from "drizzle-orm";

export const getAllSubjects = async () => {
    const subjectsList = await db.query.subjects.findMany({
        with: {
            department: true,
            faculty: {
                with: {
                    user: true,
                },
            },
        }
    });

    return subjectsList.map((subject) => {
        if (!subject.faculty) return subject;

        const { password, ...safeUser } = subject.faculty.user;

        return {
            ...subject,
            faculty: {
                ...subject.faculty,
                user: safeUser,
            },
        };
    });
};

export const getSubjectById = async (id: number) => {
    const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, id),
        with: {
            department: true,
            faculty: {
                with: {
                    user: true,
                },
            },
        }
    });

    if (!subject) {
        throw new Error("Subject not found");
    }
    
    if (!subject.faculty) {
        return subject;
    }

    const { password, ...safeUser } = subject.faculty.user;

    return {
        ...subject,
        faculty: {
            ...subject.faculty,
            user: safeUser,
        },
    };
}