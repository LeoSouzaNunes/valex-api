import { Request, Response } from "express";
import * as service from "../services/rechargesService.js";

export async function postRecharge(req: Request, res: Response) {
    const { cardId, amount } = req.body;
    await service.rechargesCard(Number(cardId), Number(amount));
    res.sendStatus(201);
}
