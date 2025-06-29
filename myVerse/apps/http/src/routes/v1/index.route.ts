import { Router } from "express";

export const router = Router();

//auth
import { auth } from "../../controllers/v1/auth.js";
router.post("/signup", auth[0]);
router.post("/signin", auth[1]);


//others
import { others } from "../../controllers/v1/others.js";
router.get("/elements", others[0]);
router.get("/avatars", others[1]);
router.delete("/allTablesAfterTest", others[2]);


//admin
import { adminRouter } from "./admin.js";
router.use("/admin", adminRouter);

//space
import { spaceRouter } from "./space.js";
router.use("/space", spaceRouter);

//userInfo
import { userInfoRouter } from "./userInfo.js";
router.use("/user", userInfoRouter);