import { Request, Response } from "express";
import client from '@repo/db/client';

import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/ayncHandler.js";
import { AddElementSchema, CreateSpaceSchema } from "../../types/index.js";
import ApiError from "../../utils/errorHandler.js";

const createSpace = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside craetespace");

    const parsedData = CreateSpaceSchema.safeParse(req.body);

    if (!parsedData || !parsedData.data) return res.status(400).send(new ApiError(400, "Validation failed"));

    if (!parsedData.data.mapId) {
        const newSpaceWithoutMapId = await client.space.create({
            data: {
                name: parsedData.data.name,
                width: Number(parsedData.data.dimensions.split("x")[0]),
                height: Number(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId as string
            },
            select: {
                id: true
            }
        });

        return res.status(200).send(new ApiResponse(200, { spaceId: newSpaceWithoutMapId.id }));
    }

    const uniqueMap = await client.map.findUnique({
        where: {
            id: parsedData.data.mapId
        },
        select: {
            mapElements: true,
            width: true,
            height: true
        }
    });

    if (!uniqueMap) return res.status(400).send(new ApiError(400, "No such map exist"));

    const newSpaceCreatedWithMapId = await client.$transaction(async () => {
        const space = (await client.space.create({
            data: {
                name: parsedData.data.name,
                width: Number(parsedData.data.dimensions.split("x")[0]),
                height: Number(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId as string
            },
            select: {
                id: true
            }
        }));

        await client.spaceElements.createMany({
            data: uniqueMap.mapElements.map(e => ({
                spaceId: space.id,
                x: e.x!,
                y: e.y!,
                elementId: e.elementId
            }))
        });
        return space;
    });

    

    return res.status(200).send(new ApiResponse(200, { spaceId: newSpaceCreatedWithMapId.id }));
});

const deleteSpace = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside deleteSpace");
    const spaceId = req.params.spaceId;

    const allSpace = await client.user.findUnique({
        where: {
            id: req.userId
        },
        select: {
            space: true
        }
    });

    const isSpaceThereOrNot = allSpace?.space.find(i => i.id === spaceId);

    if (!isSpaceThereOrNot) return res.status(400).send(new ApiError(400, "No such space found"));

    const findSpace = await client.space.findUnique({
        where: {
            id: spaceId
        },
        select: {
            creatorId: true
        }
    });

    if (!findSpace) return res.status(400).send(new ApiError(400, "No such space found"));

    if (findSpace.creatorId !== req.userId) return res.status(403).send(new ApiError(403, "Authentication failed"));

    await client.space.delete({
        where: {
            id: spaceId
        }
    });


    return res.status(200).send(new ApiResponse(200, {}, "Deletion of space sucessfull"));
});

const getAllSpace = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside getAllSpace");
    const trSpaceDetails = await client.$transaction(async () => {
        const allSpace = await client.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                space: true
            }
        });

        if (!allSpace) return res.status(400).send(new ApiError(403, "No user found"));

        const spaceDetails = await client.space.findMany({
            where: {
                id: {
                    in: allSpace.space.map(sp => sp.id)
                }
            },
            select: {
                id: true,
                name: true,
                width: true,
                height: true,
                thumbnail: true
            }
        });

        return spaceDetails;
    });

    return res.status(200).send(new ApiResponse(200, { spaces: trSpaceDetails }));
});

const getSpaceWithId = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside getSpaceWithId");
    const spaceId = req.params.spaceid;

    const allSpace = await client.user.findUnique({
        where: {
            id: req.userId
        },
        select: {
            space: true
        }
    });

    if (!allSpace) return res.status(400).send(new ApiError(400, "No space found for the user"));

    const spaceAvailableOrNot = allSpace.space.filter(e => e.id === spaceId);

    if (spaceAvailableOrNot.length === 0) return res.status(400).send(new ApiError(400, "No space found"));

    const elements = await client.space.findUnique({
        where: {
            id: spaceAvailableOrNot[0].id
        },
        select: {
            spaceElements: true
        }
    });

    return res.status(200).send(new ApiResponse(200, {
        space: spaceAvailableOrNot.map(sp => ({
            id: sp.id,
            name: sp.name,
            thumbnail: sp.thumbnail,
            dimension: `${sp.width}x${sp.height}`,
            creatorId: sp.creatorId,
            elements: elements
        }))
    }));
});

const addElementToSpace = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside addElementToSpace")
    const parsedData = AddElementSchema.safeParse(req.body);

    if (!parsedData) return res.status(400).send(new ApiError(400, "Validation failed"));

    const uniqueSpace = await client.space.findUnique({
        where: {
            id: req.body.spaceId
        },
        select: {
            spaceElements: true,
            width: true,
            height: true
        }
    });

    if (!uniqueSpace) return res.status(400).send(new ApiError(400, "No such space found"));


    if (req.body.x < 0 || req.body.x > uniqueSpace.width || req.body.y < 0 || req.body.y > uniqueSpace.height!) return res.status(400).send(new ApiError(400, "Point liesw outside the defined region"));

    await client.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    });

    return res.status(200).send(new ApiResponse(200, {}, "Sucessullly created an elemnt"));
});

const deleteElementToSpace = asyncHandler(async (req: Request, res: Response) => {
    console.log("Inside deleteElementToSpace");

    await client.$transaction(async () => {
        const uniqueSpace = await client.space.findUnique({
            where: {
                id: req.body.spaceId
            },
            select: {
                creatorId: true
            }
        });

        if (!uniqueSpace) return res.status(400).send(new ApiError(400, "No such space found"));

        if (uniqueSpace.creatorId !== req.body.userId) return res.status(403).send(new ApiError(403, "User is not associuated with the space"));

        await client.spaceElements.delete({
            where: {
                id: req.body.spaceId
            }
        });
    });

    return res.status(200).send(new ApiResponse(200, {}, "Deletion successfull"));
});


export const space = [createSpace, deleteSpace, getAllSpace, getSpaceWithId, addElementToSpace, deleteElementToSpace];