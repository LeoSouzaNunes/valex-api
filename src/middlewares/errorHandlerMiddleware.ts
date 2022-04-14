import { Request, Response, NextFunction } from "express";

export async function errorHandlerMiddleware(
    error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(error);
    return res.status(500).send(error);
}
