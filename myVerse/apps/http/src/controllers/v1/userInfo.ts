import { Request, Response } from "express";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/ayncHandler.js";
import { UpdateMetadataSchema } from "../../types/index.js";
import ApiError from "../../utils/errorHandler.js";
import client from "@repo/db/client";

const updateUserMetaData = asyncHandler(async (req: Request, res: Response) => {
  console.log("Inside updateUserMetaData");
  const parsedData = UpdateMetadataSchema.safeParse(req.body);

  if (!parsedData) return res.status(400).send(new ApiError(400, "Data validation failed"));

  if(!req.body.avatarId) return res.status(400).send(new ApiError(400, "No Id")); 

  const isAvatarPresent = await client.avatar.findUnique({
    where: {
      id: String(req.body.avatarId)
    },
    select: {
      name: true,
      imageUrl: true
    }
  });


  if(!isAvatarPresent) return res.status(400).send(new ApiError(400, "No such avatar prsent"));


  await client.user.update({
    where: {
      id: req.userId
    },
    data: {
      avatarId: parsedData.data?.avatarId
    }
  });

  return res.status(200).send(new ApiResponse(200, {}, "Sucessfully upadted Avatar"));
});

const getOtherUsersMetadata = asyncHandler(async (req: Request, res: Response) => {
  console.log("Inside getOtherUsersMetadata");
  const userIdString = (req.query.ids ?? []) as string;

  const userId = userIdString.slice(1, userIdString?.length - 1).split(",").map(item => String(item));

  let users;

  if(userId.length >1){
    users = await client.user.findMany({
      where: {
        id: {
          in: userId
        }
      },
      select: {
        avatar: true
      }
    });
  }
  else{
    users = userId
  }

  return res.status(200).send(new ApiResponse(200, {users}));
});

export const userInfo = [updateUserMetaData, getOtherUsersMetadata];