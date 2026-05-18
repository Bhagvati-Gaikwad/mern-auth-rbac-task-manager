import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import {
  createTaskValidator,
  mongoIdParamValidator,
  updateTaskValidator
} from "../validators/taskValidators.js";

export const taskRouter = Router();

taskRouter.use(protect);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List logged-in user's tasks
 *     security:
 *       - bearerAuth: []
 */
taskRouter.get("/", getTasks);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 *     security:
 *       - bearerAuth: []
 */
taskRouter.post("/", createTaskValidator, validateRequest, createTask);

taskRouter.get("/:id", mongoIdParamValidator, validateRequest, getTask);
taskRouter.put("/:id", updateTaskValidator, validateRequest, updateTask);
taskRouter.delete("/:id", mongoIdParamValidator, validateRequest, deleteTask);
