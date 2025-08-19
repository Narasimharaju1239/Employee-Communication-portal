import express from "express";
import taskController from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
const { getMyTasks, getAllTasks, assignTask, updateTaskStatus, cancelTask } = taskController;

const router = express.Router();

router.get("/mytasks", protect, getMyTasks);
router.get("/", protect, getAllTasks);
router.post("/assign", protect, assignTask);
router.patch("/status/:id", protect, updateTaskStatus);
router.delete("/cancel/:id", protect, cancelTask);

export default router;
