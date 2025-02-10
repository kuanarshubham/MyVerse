import { Request, Response } from "express";

import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/ayncHandler.js";

const createElement = asyncHandler(async(req: Request, res: Response) => {
    res.json(new ApiResponse(200, {
        id: "id_of_the_element"
    }));
});

const updateElement = asyncHandler(async (req: Request, res: Response) => {
    res.json(new ApiResponse(200, {
        id: req.params.id
    }));
});

const createAvatar = asyncHandler(async(req: Request, res: Response) => {
    res.json(new ApiResponse(200, {
        "avatarId": "123"
    }));
});

const createMap = asyncHandler(async(req: Request, res: Response) => {
    res.json(new ApiResponse(200, {
        id: "mapId"
    }));
});


export const admin = [createElement, updateElement, createAvatar, createMap];