import { Router } from "express";
import { createAssignmentController, updateAssignmentController, deleteAssignmentController, getFacultyAssignmentsController, getStudentAssignmentsController, getAllAssignmentsController } from "../controllers/assignment.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", authenticate, authorize("faculty"), createAssignmentController
);

router.put("/:id", authenticate, authorize("faculty"), updateAssignmentController
);

router.delete("/:id", authenticate, authorize("faculty"), deleteAssignmentController
);

router.get("/faculty", authenticate, authorize("faculty"), getFacultyAssignmentsController
);

router.get("/student", authenticate, authorize("student"), getStudentAssignmentsController
);

router.get("/", authenticate, authorize("admin"), getAllAssignmentsController
);

export default router;