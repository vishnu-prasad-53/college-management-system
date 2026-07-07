import { Router } from "express";

import { publishResultController, updateResultController, deleteResultController, getStudentResultsController, getFacultyResultsController, getAllResultsController } from "../controllers/result.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("faculty"), publishResultController);

router.put("/:id", authenticate, authorize("faculty"), updateResultController);

router.delete("/:id", authenticate, authorize("faculty"), deleteResultController);

router.get("/faculty", authenticate, authorize("faculty"), getFacultyResultsController);

router.get("/student", authenticate, authorize("student"), getStudentResultsController);

router.get("/", authenticate, authorize("admin"), getAllResultsController);

export default router;