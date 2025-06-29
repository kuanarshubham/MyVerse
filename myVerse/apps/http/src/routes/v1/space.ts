import { Router } from "express";
import { space } from "../../controllers/v1/space.js";
import { userMiddleware } from "../../middlewares/user.js";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, space[0]);
spaceRouter.delete("/:spaceid", userMiddleware, space[1]);
spaceRouter.get("/all", userMiddleware, space[2]);
spaceRouter.get("/:spaceid", userMiddleware, space[3]);
spaceRouter.post("/element", userMiddleware, space[4]);
spaceRouter.delete("/element", userMiddleware, space[5]);