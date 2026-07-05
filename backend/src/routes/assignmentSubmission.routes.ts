import { Router } from "express";

import { submitAssignmentController, getMySubmissionsController, getAssignmentSubmissionsController, gradeSubmissionController, getAllSubmissionsController } from "../controllers/assignmentSubmission.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("student"), submitAssignmentController);

router.get("/my", authenticate, authorize("student"), getMySubmissionsController);

router.get("/assignment/:assignmentId", authenticate, authorize("faculty"), getAssignmentSubmissionsController);

router.patch("/:id/grade", authenticate, authorize("faculty"), gradeSubmissionController);

router.get("/", authenticate, authorize("admin"), getAllSubmissionsController);

export default router;