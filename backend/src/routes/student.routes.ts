import { Router } from "express";
import { getMyProfile, updateMyProfile } from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateStudentSchema } from "../validators/student.validator.js";

const router = Router();

router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, validate(updateStudentSchema), updateMyProfile);
export default router;