import { Request, Response } from "express";

import { createBook, updateBook, deleteBook, getAllBooks, issueBook, returnBook, getStudentBorrowedBooks, getAllBorrowedBooks } from "../services/library.service.js";

export const createBookController = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await createBook(req.body);

        res.status(201).json({ success: true, message: "Book created successfully", data: book });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to create book" });
    }
};

export const updateBookController = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = Number(req.params.id);

        if (isNaN(bookId) || bookId <= 0) {
            res.status(400).json({ success: false, message: "Invalid book ID" });
            return;
        }

        const book = await updateBook(bookId, req.body);

        res.status(200).json({ success: true, message: "Book updated successfully", data: book });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to update book" });
    }
};

export const deleteBookController = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = Number(req.params.id);

        if (isNaN(bookId) || bookId <= 0) {
            res.status(400).json({ success: false, message: "Invalid book ID" });
            return;
        }

        const result = await deleteBook(bookId);

        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to delete book" });
    }
};

export const getAllBooksController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const books = await getAllBooks();

        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch books" });
    }
};

export const issueBookController = async (req: Request, res: Response): Promise<void> => {
    try {
        const issue = await issueBook(req.body);

        res.status(201).json({ success: true, message: "Book issued successfully", data: issue });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to issue book" });
    }
};

export const returnBookController = async (req: Request, res: Response): Promise<void> => {
    try {
        const borrowId = Number(req.params.id);

        if (isNaN(borrowId) || borrowId <= 0) {
            res.status(400).json({ success: false, message: "Invalid borrow ID" });
            return;
        }

        const returned = await returnBook(borrowId, req.body);

        res.status(200).json({ success: true, message: "Book returned successfully", data: returned });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Failed to return book" });
    }
};

export const getStudentBorrowedBooksController = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = Number(req.params.studentId);

        if (isNaN(studentId) || studentId <= 0) {
            res.status(400).json({ success: false, message: "Invalid student ID" });
            return;
        }

        const books = await getStudentBorrowedBooks(studentId);

        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch borrowed books" });
    }
};

export const getAllBorrowedBooksController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const books = await getAllBorrowedBooks();

        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Failed to fetch borrowed books" });
    }
};