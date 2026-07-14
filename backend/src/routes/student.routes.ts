import { Router } from "express";
import { createStudentController, deleteStudentController, getMyProfile, getStudent, getStudents, updateMyProfile, updateStudentController } from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createStudentSchema, updateStudentSchema } from "../validators/student.validator.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), getStudents);
router.get("/:id", authenticate, authorize("admin"), getStudent);
router.post("/", authenticate, authorize("admin"), validate(createStudentSchema), createStudentController);
router.put("/:id", authenticate, authorize("admin"), validate(updateStudentSchema), updateStudentController);
router.delete("/:id", authenticate, authorize("admin"), deleteStudentController);
router.get("/me", authenticate, getMyProfile);
router.put("/me", authenticate, validate(updateStudentSchema), updateMyProfile);
export default router;