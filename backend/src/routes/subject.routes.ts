import { Router } from "express";
import { getSubjects, getSubject } from "../controllers/subject.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getSubjects);
router.get("/:id", authenticate, getSubject);

export default router;