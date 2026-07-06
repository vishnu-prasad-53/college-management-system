import { Router } from "express";

import { createExamController, updateExamController, deleteExamController, getFacultyExamsController, getStudentExamsController, getAllExamsController } from "../controllers/exam.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("faculty"), createExamController );

router.put("/:id", authenticate, authorize("faculty"), updateExamController );

router.delete("/:id", authenticate, authorize("faculty"), deleteExamController );

router.get("/faculty", authenticate, authorize("faculty"), getFacultyExamsController );

router.get("/student", authenticate, authorize("student"), getStudentExamsController );

router.get("/", authenticate, authorize("admin"), getAllExamsController );

export default router;