import { Router } from "express";
import { createLeaveRequestController, getMyLeaveRequestsController, getAllLeaveRequestsController, updateLeaveStatusController, deleteLeaveRequestController } from "../controllers/leave.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("faculty"), createLeaveRequestController);

router.get("/my", authenticate, authorize("faculty"), getMyLeaveRequestsController);

router.get( "/", authenticate, authorize("admin"), getAllLeaveRequestsController);

router.patch("/:id", authenticate, authorize("admin"), updateLeaveStatusController);

router.delete("/:id", authenticate, authorize("admin"), deleteLeaveRequestController);

export default router;