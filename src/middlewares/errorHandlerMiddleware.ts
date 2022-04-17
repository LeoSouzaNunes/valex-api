import { Request, Response, NextFunction } from "express";

export async function errorHandlerMiddleware(
    error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error.type === "unprocessable_entity") {
        return res.status(422).send(error.message);
    }
    if (error.type === "unauthorized") {
        return res.status(401).send(error.message);
    }
    if (error.type === "not_found") {
        return res.status(404).send(error.message);
    }
    if (error.type === "conflict") {
        return res.status(409).send(error.message);
    }
    if (error.type === "bad_request") {
        return res.status(400).send(error.message);
    }
    console.log(error);
    return res.status(500).send(error);
}
