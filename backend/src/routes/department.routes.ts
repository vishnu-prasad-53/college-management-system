import { Router } from "express";
import { getDepartments, getDepartment, createDepartmentController, updateDepartmentController, deleteDepartmentController } from "../controllers/department.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { createDepartmentSchema, updateDepartmentSchema } from "../validators/department.validator.js";

const router = Router();

router.get("/", authenticate, getDepartments);

router.get("/:id", authenticate, getDepartment);

router.post("/", authenticate, authorize("admin"), validate(createDepartmentSchema), createDepartmentController);

router.put("/:id", authenticate, authorize("admin"), validate(updateDepartmentSchema), updateDepartmentController);

router.delete("/:id", authenticate, authorize("admin"), deleteDepartmentController);

export default router;