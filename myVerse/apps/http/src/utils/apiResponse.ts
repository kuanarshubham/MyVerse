class ApiResponse{
    statusCode: number;
    message: string;
    data: object;
    
    constructor(statusCode: number, data: object, message= "Sucess"){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

export  {ApiResponse};