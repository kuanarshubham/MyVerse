import { Router } from "express";
import { userInfo } from "../../controllers/v1/userInfo.js";

export const userInfoRouter = Router();

userInfoRouter.post("/metadata", userInfo[0]);
userInfoRouter.get("/metadata/bulk", userInfo[1]);