import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/ayncHandler";

const signup = asyncHandler(async(req, res) => {
    res.send(new ApiResponse(200, {
        "userId": "1"
    }));
})


const signin = asyncHandler(async(req, res) => {
    res.json(new ApiResponse(200, {
        "token": "123mkadsfjaidsj90120j0dj0jkq0dwj"
    }));
});


export const auth = [signup, signin];