import { Request, Response } from "express";
import { checkIsValidEmployeeAndCreateCard } from "../services/cardsService.js";

export async function postCard(req: Request, res: Response) {
    const { employeeId, type } = req.body;
    const data = await checkIsValidEmployeeAndCreateCard(employeeId, type);

    return res.status(201).send(data);
}
