import { Router } from "express";
import { space } from "../../controllers/v1/space.js";

export const spaceRouter = Router();

spaceRouter.post("/", space[0]);
spaceRouter.delete("/:spaceid", space[1]);
spaceRouter.get("/all", space[2]);
spaceRouter.get("/:spaceid", space[3]);
spaceRouter.post("/element", space[4]);
spaceRouter.delete("/element", space[5]);