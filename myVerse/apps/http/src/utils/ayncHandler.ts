import { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) =>
        Promise
            .resolve(fn(req, res, next))
            .catch((error) => {
                console.log("Inside the Catch of asyncHandler.ts: ", error);
                next(error);
            });
};

// export const asH = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (
//     async(req: Request, res: Response, next: NextFunction) => {
//         try{
//             return await fn(req, res, next);
//         }
//         catch(e){
//             console.log(e);
//             next(e);
//         }
//     }
// )
