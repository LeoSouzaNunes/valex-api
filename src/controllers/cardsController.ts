import { Request, Response } from "express";
import * as service from "../services/cardsService.js";

export async function postCard(req: Request, res: Response) {
    const { employeeId, type } = req.body;
    const cardData = await service.checkIsValidEmployeeAndCreateCard(
        employeeId,
        type
    );

    return res.status(201).send(cardData);
}

export async function getCards(req: Request, res: Response) {
    const employeeId = res.locals.param;
    const cards = await service.findCards(employeeId);
    res.status(200).send(cards);
}

export async function updateCard(req: Request, res: Response) {
    const cardId = res.locals.param;
    const { cvv, password } = req.body;

    await service.activateCard(cardId, cvv, password);
    res.sendStatus(200);
}

export async function getCardTrades(req: Request, res: Response) {
    const cardId = res.locals.param;
    const trades = await service.findCardTrades(cardId);
    res.status(200).send(trades);
}
