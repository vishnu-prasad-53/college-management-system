import { Router } from "express";
import { createMarksController, getMyMarksController, getMarksBySubjectController } from "../controllers/marks.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { marksSchema } from "../validators/marks.validator.js";

const router = Router();

router.post("/", authenticate, authorize("faculty", "admin"), validate(marksSchema), createMarksController);

router.get("/me", authenticate, authorize("student"), getMyMarksController);

router.get("/subject/:subjectId", authenticate, authorize("faculty", "admin"), getMarksBySubjectController);

export default router;