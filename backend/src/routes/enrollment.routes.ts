import { Router } from "express";
import { enroll, getMySubjects, removeEnrollment, getStudents } from "../controllers/enrollment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { enrollmentSchema } from "../validators/enrollment.validator.js";

const router = Router();

router.post("/", authenticate, authorize("student"), validate(enrollmentSchema), enroll);

router.get("/me", authenticate, authorize("student"), getMySubjects);

router.delete("/:subjectId", authenticate, authorize("student"), removeEnrollment);

router.get("/subject/:subjectId", authenticate, authorize("faculty", "admin"), getStudents);

export default router;