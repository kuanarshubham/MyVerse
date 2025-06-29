import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/ayncHandler.js";
import ApiError from "../utils/errorHandler.js";
import { SECRET_KEY } from "../config.js";

declare global {
    namespace Express {
        export interface Request {
            role?: "Admin" | "User";
            userId?: string;
        }
    }
}

export const adminMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send(new ApiError(401, "Unauthorised"));

    const token = authHeader.split(" ")[1];

    if (token === "undefined" || !token) return res.status(401).send(new ApiError(401, "Unauthorised"));

    const decodedToken = jwt.verify(token, SECRET_KEY) as { role: string, userId: string };

    if(decodedToken.role!== "Admin") return res.status(403).send(new ApiError(403, "Unauthorized"));

    req.userId = decodedToken.userId;
    next();
});
