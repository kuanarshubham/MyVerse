import { Router } from "express";

export const router = Router();

//auth
import { auth } from "../../controllers/v1/auth";
router.get("/signup", auth[0]);
router.get("/signin", auth[1]);


//others
import { others } from "../../controllers/v1/others";
router.get("/avatar", others[0]);
router.get("/elements", others[1]);


//admin
import { adminRouter } from "./admin";
router.use("/admin", adminRouter);

//space
import { spaceRouter } from "./space";
router.use("/space", spaceRouter);

//userInfo
import { userInfoRouter } from "./userInfo";
router.use("/user", userInfoRouter);