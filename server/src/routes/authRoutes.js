import { Router } from "express";
import { getMe, login, register } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/errorHandler.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

export const authRouter = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a user
 */
authRouter.post("/register", registerValidator, validateRequest, register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive JWT
 */
authRouter.post("/login", loginValidator, validateRequest, login);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 */
authRouter.get("/me", protect, getMe);
