import { Router } from "express";
import { getUsers } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(protect, restrictTo("admin"));

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users, admin only
 *     security:
 *       - bearerAuth: []
 */
adminRouter.get("/users", getUsers);
