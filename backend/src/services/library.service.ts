import { and, eq } from "drizzle-orm";

import { db, books, borrowedBooks, students } from "../db/index.js";

import type { CreateBookInput, UpdateBookInput, IssueBookInput, ReturnBookInput } from "../validators/library.validator.js";

export const createBook = async (data: CreateBookInput) => {
    const existing = await db.query.books.findFirst({
        where: eq(books.isbn, data.isbn),
    });

    if (existing) {
        throw new Error("Book with this ISBN already exists");
    }

    const [book] = await db.insert(books).values({
        title: data.title,
        author: data.author,
        isbn: data.isbn,
        publisher: data.publisher,
        category: data.category,
        totalCopies: data.totalCopies,
        availableCopies: data.totalCopies,
    }).returning();

    return book;
};

export const updateBook = async (bookId: number, data: UpdateBookInput) => {
    const existing = await db.query.books.findFirst({
        where: eq(books.id, bookId),
    });

    if (!existing) {
        throw new Error("Book not found");
    }

    let availableCopies = existing.availableCopies;

    if (data.totalCopies !== undefined) {
        const borrowed = existing.totalCopies - existing.availableCopies;

        if (data.totalCopies < borrowed) {
            throw new Error("Total copies cannot be less than borrowed copies");
        }

        availableCopies = data.totalCopies - borrowed;
    }

    if (data.isbn) {
        const isbnExists = await db.query.books.findFirst({
            where: eq(books.isbn, data.isbn),
        });

        if (isbnExists && isbnExists.id !== bookId) {
            throw new Error("ISBN already exists");
        }
    }

    const [updated] = await db.update(books).set({
        ...(data.title && { title: data.title }),
        ...(data.author && { author: data.author }),
        ...(data.isbn && { isbn: data.isbn }),
        ...(data.publisher && { publisher: data.publisher }),
        ...(data.category && { category: data.category }),
        ...(data.totalCopies !== undefined && { totalCopies: data.totalCopies, availableCopies }),
    }).where(eq(books.id, bookId)).returning();

    return updated;
};

export const deleteBook = async (bookId: number) => {
    const existing = await db.query.books.findFirst({
        where: eq(books.id, bookId),
    });

    if (!existing) {
        throw new Error("Book not found");
    }

    if (existing.availableCopies !== existing.totalCopies) {
        throw new Error("Cannot delete a borrowed book");
    }

    await db.delete(books).where(eq(books.id, bookId));

    return {
        message: "Book deleted successfully",
    };
};

export const getAllBooks = async () => {
    return await db.query.books.findMany();
};

export const issueBook = async (data: IssueBookInput) => {
    const student = await db.query.students.findFirst({
        where: eq(students.id, data.studentId),
    });

    if (!student) {
        throw new Error("Student not found");
    }

    const book = await db.query.books.findFirst({
        where: eq(books.id, data.bookId),
    });

    if (!book) {
        throw new Error("Book not found");
    }

    if (book.availableCopies <= 0) {
        throw new Error("Book is currently unavailable");
    }

    const alreadyBorrowed = await db.query.borrowedBooks.findFirst({
        where: and(
            eq(borrowedBooks.studentId, data.studentId),
            eq(borrowedBooks.bookId, data.bookId),
            eq(borrowedBooks.status, "borrowed"),
        ),
    });

    if (alreadyBorrowed) {
        throw new Error("Student already borrowed this book");
    }

    const borrowedCount = await db.query.borrowedBooks.findMany({
        where: and(
            eq(borrowedBooks.studentId, data.studentId),
            eq(borrowedBooks.status, "borrowed"),
        ),
    });

    if (borrowedCount.length >= 5) {
        throw new Error("Student has reached maximum borrowing limit");
    }

    const [issue] = await db.insert(borrowedBooks).values({
        studentId: data.studentId,
        bookId: data.bookId,
        borrowDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(data.dueDate).toISOString().split("T")[0],
        status: "borrowed",
    }).returning();

    await db.update(books).set({ availableCopies: book.availableCopies - 1 }).where(eq(books.id, book.id));

    return issue;
};

export const returnBook = async (borrowId: number, data: ReturnBookInput) => {
    const issue = await db.query.borrowedBooks.findFirst({
        where: eq(borrowedBooks.id, borrowId),
        with: {
            book: true,
        },
    });

    if (!issue) {
        throw new Error("Borrow record not found");
    }

    if (issue.status === "returned") {
        throw new Error("Book already returned");
    }

    const [updated] = await db.update(borrowedBooks).set({
        returnDate: (data.returnDate ?? new Date()).toISOString().split("T")[0],
        status: "returned",
    }).where(eq(borrowedBooks.id, borrowId)).returning();
    await db.update(books).set({ availableCopies: issue.book.availableCopies + 1 }).where(eq(books.id, issue.book.id));
    return updated;
};

export const getStudentBorrowedBooks = async (studentId: number) => {
    return await db.query.borrowedBooks.findMany({
        where: eq(
            borrowedBooks.studentId,
            studentId
        ),
        with: {
            book: true,
        },
    });
};

export const getAllBorrowedBooks = async () => {
    const records = await db.query.borrowedBooks.findMany({
        with: {
            student: {
                with: {
                    user: true,
                },
            },
            book: true,
        },
    });

    return records.map((record) => {
        const { password, ...safeUser } = record.student.user;

        return {
            ...record,
            student: {
                ...record.student,
                user: safeUser,
            },
        };
    });

};