import { Router } from "express";

import { createBookController, updateBookController, deleteBookController, getAllBooksController, issueBookController, returnBookController, getStudentBorrowedBooksController, getAllBorrowedBooksController } from "../controllers/library.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/books", authenticate, authorize("admin"), createBookController);

router.put("/books/:id", authenticate, authorize("admin"), updateBookController);

router.delete("/books/:id", authenticate, authorize("admin"), deleteBookController);

router.get("/books", authenticate, authorize("admin"), getAllBooksController);

router.get("/borrowed", authenticate, authorize("admin"), getAllBorrowedBooksController);

router.post("/issue", authenticate, authorize("faculty"), issueBookController);

router.patch("/return/:id", authenticate, authorize("faculty"), returnBookController);

router.get("/student/:studentId", authenticate, authorize("student"), getStudentBorrowedBooksController);

export default router;