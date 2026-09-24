import express from "express";
import { createStudent, getStudents, updateStudentStatus, deleteStudent } from "../controllers/studentController.js";
import { protect } from "../middleware/Auth.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/", protect, getStudents);
router.patch("/:id", protect, updateStudentStatus);
router.delete("/:id", protect, deleteStudent);

export default router;
