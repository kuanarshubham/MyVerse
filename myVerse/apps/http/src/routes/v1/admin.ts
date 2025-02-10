import { Router } from "express";
import { admin } from "../../controllers/v1/admin.js";

export const adminRouter = Router();

adminRouter.post("/element", admin[0]);
adminRouter.put("/element/:id", admin[1]);
adminRouter.post("/avatar", admin[2]);
adminRouter.post("/map", admin[3]);