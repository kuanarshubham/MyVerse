import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/ayncHandler";

const createElement = asyncHandler(async(req, res) => {
    res.json(new ApiResponse(200, {
        id: "id_of_the_element"
    }));
});

const updateElement = asyncHandler(async(req, res) => {
    res.json(new ApiResponse(200, {
        id: req.params.id
    }));
});

const createAvatar = asyncHandler(async(req, res) => {
    res.json(new ApiResponse(200, {
        "avatarId": "123"
    }));
});

const createMap = asyncHandler(async(req, res) => {
    res.json(new ApiResponse(200, {
        id: "mapId"
    }));
});


export const admin = [createElement, updateElement, createAvatar, createMap];