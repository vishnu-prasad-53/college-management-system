import { Router } from "express";
import { markStudentAttendance, getMyAttendanceRecords, getSubjectAttendance } from "../controllers/attendance.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { attendanceSchema } from "../validators/attendance.validator.js";

const router = Router();

router.post("/", authenticate, authorize("faculty", "admin"), validate(attendanceSchema), markStudentAttendance);

router.get("/me", authenticate, authorize("student"), getMyAttendanceRecords);

router.get("/subject/:subjectId", authenticate, authorize("faculty", "admin"), getSubjectAttendance);

export default router;