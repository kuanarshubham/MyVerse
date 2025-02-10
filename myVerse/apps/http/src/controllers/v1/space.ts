import { Request, Response } from "express";

import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/ayncHandler.js";

const createSpace = asyncHandler(async(req: Request, res: Response) => {
    res.json(new ApiResponse(200, {
        "spaceId": "xlapwep1"
     }));
});

const deleteSpace = asyncHandler(async(req: Request, res: Response)=> {
    res.json(new ApiResponse(200, {}));
});

const getAllSpace = asyncHandler(async(req: Request, res: Response)=> {
    res.json(new ApiResponse(200, {
        "spaces": [{
           "id": 1,
               "name": "Test",
             "dimensions": "100x200",
             "thumbnail": "https://google.com/cat.png"
          }, {
             "id": 2,
               "name": "Test",
             "dimensions": "100x200",
             "thumbnail": "https://google.com/cat.png"
          }]
      }));
});

const getSpaceWithId = asyncHandler(async(req: Request, res: Response)=> {
    res.json(new ApiResponse(200, {
        "dimensions": "100x200",
        "elements": [{
                 id: 1,
                element: {
                  "id": "chair1",
                  "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                  "static": false,
                  "height": 1,
                  "width": 1
                },
                x: 20,
                y: 20
            }, {
                 id: 2,
              element: {
                  "id": "chair2",
                  "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
                  "static": false,
                  "height": 1,
                  "width": 1
                },
                x: 18,
                y: 20
            }, {
                 id: 3,
              element: {
                  "id": "table1",
                  "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5El5F7QtBVHhSpkQMSzPSDoiQWl3Q7fRG3w&s",
                  "static": true,
                  "height": 1,
                  "width": 1		   
                },
                x: 19,
                y: 20
            }
        ]
     }));
});

const addElementToSpace = asyncHandler(async(req: Request, res: Response)=> {
    res.json(new ApiResponse(200, {}));
});

const deleteElementToSpace = asyncHandler(async(req: Request, res: Response)=> {
    res.json(new ApiResponse(200, {}));
});


export const space = [createSpace, deleteSpace, getAllSpace, getSpaceWithId, addElementToSpace, deleteElementToSpace];