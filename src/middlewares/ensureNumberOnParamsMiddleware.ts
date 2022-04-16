import { NextFunction, Request, Response } from "express";
import { unprocessable } from "../utils/errorUtils.js";

export default function ensureNumberOnParamsMiddleware(paramName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const paramValue = Number(req.params[paramName]);

        if (!paramValue) {
            throw unprocessable("Invalid param value.");
        }
        res.locals.param = paramValue;
        next();
    };
}
