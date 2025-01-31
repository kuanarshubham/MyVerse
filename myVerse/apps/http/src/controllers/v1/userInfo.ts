import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/ayncHandler";

const updateUserMetaData = asyncHandler(async(req, res) => {
    res.json(new ApiResponse(200, {}));
});

const getOtherUsersMetadata = asyncHandler(async(req, res)=> {
    res.json(new ApiResponse(200, {
        "avatars": [{
          "userId": 1,
          "imageUrl": "https://image.com/cat.png"
        }, {
          "userId": 3,
          "imageUrl": "https://image.com/cat2.png"
        }, {
          "userId": 55,
          "imageUrl": "https://image.com/cat3.png"
        }]
      }));
});

export const userInfo = [updateUserMetaData, getOtherUsersMetadata];