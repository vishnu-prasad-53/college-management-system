import { Router } from "express";
import { createNoticeController, updateNoticeController, deleteNoticeController, getAllNoticesForAdminController, getActiveNoticesController } from "../controllers/notice.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("admin"), createNoticeController);

router.put("/:id", authenticate, authorize("admin"), updateNoticeController);

router.delete("/:id", authenticate, authorize("admin"), deleteNoticeController);

router.get("/admin", authenticate, authorize("admin"), getAllNoticesForAdminController);

router.get("/", authenticate, authorize("student", "faculty"), getActiveNoticesController);

export default router;