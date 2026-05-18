import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Auth RBAC Task API",
      version: "1.0.0",
      description: "Versioned REST API with JWT authentication, role-based access, and task CRUD."
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Asha Sharma" },
            email: { type: "string", example: "asha@example.com" },
            password: { type: "string", example: "Password123" }
          }
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "asha@example.com" },
            password: { type: "string", example: "Password123" }
          }
        },
        TaskInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Finish intern assignment" },
            description: { type: "string", example: "Build backend and basic frontend" },
            status: { type: "string", enum: ["todo", "in-progress", "done"] },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            dueDate: { type: "string", format: "date" }
          }
        }
      }
    },
    paths: {
      "/api/v1/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterInput" }
              }
            }
          },
          responses: {
            201: { description: "Registration successful" },
            400: { description: "Validation failed" },
            409: { description: "Email already registered" }
          }
        }
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginInput" }
              }
            }
          },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" }
          }
        }
      },
      "/api/v1/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get logged-in user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Current user" },
            401: { description: "Unauthorized" }
          }
        }
      },
      "/api/v1/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "List tasks owned by logged-in user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Task list" }
          }
        },
        post: {
          tags: ["Tasks"],
          summary: "Create task",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskInput" }
              }
            }
          },
          responses: {
            201: { description: "Task created" },
            400: { description: "Validation failed" }
          }
        }
      },
      "/api/v1/tasks/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get one task",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Task found" }, 404: { description: "Task not found" } }
        },
        put: {
          tags: ["Tasks"],
          summary: "Update task",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskInput" }
              }
            }
          },
          responses: { 200: { description: "Task updated" }, 404: { description: "Task not found" } }
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete task",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Task deleted" }, 404: { description: "Task not found" } }
        }
      },
      "/api/v1/admin/users": {
        get: {
          tags: ["Admin"],
          summary: "List all users, admin only",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "User list" },
            403: { description: "Forbidden" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
});
