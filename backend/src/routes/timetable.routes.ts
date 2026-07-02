import { Router } from "express";
import { createTimetableController, updateTimetableController, deleteTimetableController, getStudentTimetableController, getFacultyTimetableController, getDepartmentTimetableController } from "../controllers/timetable.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("admin"), createTimetableController);

router.put("/:id", authenticate, authorize("admin"), updateTimetableController);

router.delete("/:id", authenticate, authorize("admin"), deleteTimetableController);

router.get("/department/:departmentId/:semester", authenticate, authorize("admin"), getDepartmentTimetableController);

router.get("/student", authenticate, authorize("student"), getStudentTimetableController);

router.get("/faculty", authenticate, authorize("faculty"), getFacultyTimetableController);

export default router;