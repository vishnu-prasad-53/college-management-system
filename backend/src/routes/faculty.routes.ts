import { Router } from "express";
import { getMyProfile, updateMyProfile } from "../controllers/faculty.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateFacultySchema } from "../validators/faculty.validator.js";

const router = Router();

router.get("/me", authenticate, authorize("faculty"), getMyProfile);

router.put("/me", authenticate, authorize("faculty"), validate(updateFacultySchema), updateMyProfile);

export default router;