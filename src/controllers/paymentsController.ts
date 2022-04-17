import { Request, Response } from "express";
import * as services from "../services/paymentsService.js";

export async function postPayment(req: Request, res: Response) {
    const { cardId, businessId, amount, password } = req.body;
    await services.depositsPayment(
        Number(cardId),
        Number(businessId),
        Number(amount),
        password
    );
    res.sendStatus(201);
}
