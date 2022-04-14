import { NextFunction, Request, Response } from "express";
import { checkKey } from "../services/cardsService.js";

export default async function validateKeyMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const key = req.headers["x-api-key"];
    const companyData = await checkKey(key);
    res.locals.company = companyData;
    next();
}
