import { z } from "zod";

export const createBookSchema = z.object({
    title: z.string().trim().min(2).max(150),
    author: z.string().trim().min(2).max(100),
    isbn: z.string().trim().min(10).max(20),
    publisher: z.string().trim().min(2).max(100),
    category: z.string().trim().min(2).max(50),
    totalCopies: z.coerce.number().int().min(1),
});

export const updateBookSchema = createBookSchema.partial();

const today = new Date();
today.setHours(0, 0, 0, 0);

export const issueBookSchema = z.object({
    bookId: z.coerce.number().int().positive(),
    studentId: z.coerce.number().int().positive(),
    dueDate: z.coerce.date(),
}).refine((data) => data.dueDate >= today,
    {
        message: "Due date cannot be in the past",
        path: ["dueDate"],
    }
);

export const returnBookSchema = z.object({
    returnDate: z.coerce.date().optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type IssueBookInput = z.infer<typeof issueBookSchema>;
export type ReturnBookInput = z.infer<typeof returnBookSchema>;