import { Router } from "express";
import { userInfo } from "../../controllers/v1/userInfo.js";
import { userMiddleware } from "../../middlewares/user.js";

export const userInfoRouter = Router();

userInfoRouter.post("/metadata", userMiddleware, userInfo[0]);
userInfoRouter.get("/metadata/bulk", userInfo[1]);