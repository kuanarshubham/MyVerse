import { Request, Response } from "express";
import client from '@repo/db/client';

import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/ayncHandler.js";
import ApiError from "../../utils/errorHandler.js";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types/index.js";


const createElement = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside createElement");

    const parsedData = CreateElementSchema.safeParse(req.body);

    if (!parsedData || !parsedData.data) return (new ApiError(400, "Validation failed"));

    const newElementCreated = await client.element.create({
        data: {
            width: Number(parsedData.data.width)!,
            height: Number(parsedData.data.height)!,
            imageUrl: parsedData.data.imageUrl!
        },
        select: {
            id: true
        }
    });

    return res.status(200).send(new ApiResponse(200, { id: newElementCreated.id }));
});

const updateElement = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside Update elements")
    const parsedData  = UpdateElementSchema.safeParse(req.body);

    if (!parsedData || !parsedData.data) return (new ApiError(400, "Validation failed"));

    const updatedElement = await client.element.update({
        where: {
            id: req.params.id
        },
        data: {
            imageUrl: parsedData.data.imageUrl
        },
        select: {
            id:  true,
            imageUrl: true
        }
    });

    return res.status(200).send(new ApiResponse(200, {updatedElement}));
});

const createAvatar = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside createAvatar");
    const parsedData = CreateAvatarSchema.safeParse(req.body);

    if (!parsedData) return (new ApiError(400, "Validation failed"));

    const avatarCreationRes = await client.avatar.create({
        data: {
            imageUrl: parsedData.data?.imageUrl,
            name: parsedData.data?.name
        }
    });


    return res.status(200).json(new ApiResponse(200, {
        "avatarId": avatarCreationRes.id
    }, "Succesful Creation of Avatar"));
});

const createMap = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside Createmap");
    const parsedData = CreateMapSchema.safeParse(req.body);

    if (!parsedData || !parsedData.data) return res.status(400).send(new ApiError(400, "Validation failed"));

    const newMap = await client.$transaction(async () => {
        const newMapCreated = await client.map.create({
            data: {
                width: Number(parsedData.data.dimensions.split("x")[0]),
                height: Number(parsedData.data.dimensions.split("x")[1]),
                name: parsedData.data.name,
                thumbnail: parsedData.data.thumbnail
            },
            select: {
                id: true
            }
        });

        const mapElementsCreated = await client.mapElements.createMany({
            data: parsedData.data.defaultElements.map(e => ({
                mapId: newMapCreated.id,
                elementId: e.elementId,
                x: e.x,
                y: e.y
            }))
        });

        return newMapCreated;
    });

    return res.status(200).send(new ApiResponse(200, { id: newMap.id }));
});


export const admin = [createElement, updateElement, createAvatar, createMap];