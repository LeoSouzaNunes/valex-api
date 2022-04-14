import { NextFunction, Request, Response } from "express";

export default function validateSchemaMiddleware(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            throw {
                type: "unprocessable_entity",
                message: "Invalid body object.",
            };
        }
        next();
    };
}
