import { body, param } from "express-validator";

export const mongoIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid task id")
];

export const createTaskValidator = [
  body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title must be 3-120 characters"),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description is too long"),
  body("status").optional().isIn(["todo", "in-progress", "done"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("dueDate").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Due date must be valid")
];

export const updateTaskValidator = [
  ...mongoIdParamValidator,
  body("title").optional().trim().isLength({ min: 3, max: 120 }).withMessage("Title must be 3-120 characters"),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description is too long"),
  body("status").optional().isIn(["todo", "in-progress", "done"]).withMessage("Invalid status"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("dueDate").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Due date must be valid")
];
