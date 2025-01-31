const createElements = (req: any, res: any) => {
    res.json({
        route: ""
    });
} 

const getAllAvatars = (req: any, res: any) => {
    res.json({
        route: "This route is admin"
    });
} 

export const others = [createElements, getAllAvatars];