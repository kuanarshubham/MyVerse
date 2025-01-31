import { Router } from "express";
import { space } from "../../controllers/v1/space";

export const spaceRouter = Router();

spaceRouter.post("/space", space[0]);
spaceRouter.delete("/space/:spaceid", space[1]);
spaceRouter.get("/space/all", space[2]);
spaceRouter.get("/space/:spaceid", space[3]);
spaceRouter.post("/space/element", space[4]);
spaceRouter.delete("/space/element", space[5]);