import { Router } from "express";
import { admin } from "../../controllers/v1/admin.js";
import { adminMiddleware } from "../../middlewares/admin.js";

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, admin[0]);
adminRouter.put("/element/:id", adminMiddleware, admin[1]);
adminRouter.post("/avatar", adminMiddleware, admin[2]);
adminRouter.post("/map", adminMiddleware, admin[3]);