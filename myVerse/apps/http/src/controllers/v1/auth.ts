import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import client from "@repo/db/client";

import { SigninSchema, SignupSchema } from "../../types/index.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/ayncHandler.js";
import { SECRET_KEY } from "../../config.js";
import ApiError from "../../utils/errorHandler.js";


const signup = asyncHandler(async(req: Request, res: Response) => {
    console.log("Inside signup");
    const parsedData = SignupSchema.safeParse(req.body);

    if(!parsedData.success) {return res.status(400).send(new ApiError(400, `Validation issue at sign-up`))}

    const findUser = await client.user.findUnique({
        where: {
            username: parsedData.data.username
        }
    });

    if(findUser) return res.status(409).send(new ApiError(409, "Username already exist"));

    const createUser = await client.user.create({
        data: {
            username: parsedData.data.username,
            password: parsedData.data.password,
            role: parsedData.data.type === "admin"? "Admin": "User"
        }
    });

    return res.status(200).send(new ApiResponse(200, {
        userId: createUser.id
    }, "Sucessful validation"));
})


// TODO: Used no bycrypt library, due to clashes 
const signin = asyncHandler(async(req: Request, res: Response) => {
    console.log("Inside signin");
    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success) return res.status(400).send(new ApiError(400, `Validation issue at sign-in`))

    const findUser = await client.user.findUnique({
        where: {
            username: parsedData.data.username
        }
    });

    if(!findUser) return res.status(404).send(new ApiError(404, "No such username exist"));

    if(findUser.password !== parsedData.data.password) return res.status(400).send(new ApiResponse(400, {}, "Wrong password"));

    const token = jwt.sign({
        userId: findUser.id,
        role: findUser.role
    }, SECRET_KEY);

    return res.status(200).send(new ApiResponse(200, {
        token
    }, "User sucessfully sign-in"));
});

export const auth = [signup, signin];