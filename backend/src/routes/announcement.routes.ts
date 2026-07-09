import { Router } from "express";

import { createAnnouncementController, updateAnnouncementController, deleteAnnouncementController, getMyAnnouncementsController, getAllAnnouncementsController, getAnnouncementByIdController } from "../controllers/announcement.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();


router.post("/", authenticate, authorize("admin", "faculty"), createAnnouncementController);

router.put("/:id", authenticate, authorize("admin", "faculty"), updateAnnouncementController);

router.delete("/:id", authenticate, authorize("admin", "faculty"), deleteAnnouncementController);

router.get("/my", authenticate, authorize("admin", "faculty"), getMyAnnouncementsController);

router.get("/:id", authenticate, getAnnouncementByIdController);

router.get("/", authenticate, getAllAnnouncementsController);

export default router;