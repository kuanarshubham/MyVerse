import { Request, Response } from "express";
import client from "@repo/db/client";
import { asyncHandler } from "../../utils/ayncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

const createElements = (req: Request, res: Response) => {
    res.json({
        route: ""
    });
} 

const getAllAvatars = (req: Request, res: Response) => {
    res.json({
        route: "This route is admin"
    });
} 

const deleteAllDataFromAllTable = asyncHandler(async(req: Request, res:Response) => {
    const avtarRes = await client.avatar.deleteMany({});
    const elementRes = await client.element.deleteMany({});
    const mapRes = await client.map.deleteMany({});
    const spaceRes = await client.space.deleteMany({});
    const userRes = await client.user.deleteMany({});
    const mapElementsRes = await client.mapElements.deleteMany({});
    const spaceElementsRes = await client.spaceElements.deleteMany({});

    return res.status(200).send(new ApiResponse(200, {avtarRes, elementRes, mapRes, spaceRes, userRes, mapElementsRes, spaceElementsRes}, "Sucessful"));
});

export const others = [createElements, getAllAvatars, deleteAllDataFromAllTable];