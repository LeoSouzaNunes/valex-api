import { NextFunction, Request, Response } from "express";
import { unprocessable } from "../utils/errorUtils.js";

export default function validateSchemaMiddleware(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            throw unprocessable("Invalid schema.");
        }
        next();
    };
}
