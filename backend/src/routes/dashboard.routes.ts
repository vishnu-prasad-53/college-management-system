import { Router } from "express";
import { getOverviewController, getStudentStatisticsController, getFacultyStatisticsController, getAttendanceStatisticsController, getMarksStatisticsController, getRecentActivityController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get("/overview", authenticate, authorize("admin"), getOverviewController);

router.get("/students", authenticate, authorize("admin"), getStudentStatisticsController);

router.get("/faculty", authenticate, authorize("admin"), getFacultyStatisticsController);

router.get("/attendance", authenticate, authorize("admin"), getAttendanceStatisticsController);

router.get("/marks", authenticate, authorize("admin"), getMarksStatisticsController);

router.get("/recent-activity", authenticate, authorize("admin"), getRecentActivityController);

export default router;