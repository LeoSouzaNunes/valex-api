import { Router } from "express";
import { postCard } from "../controllers/cardsController.js";
import validateKeyMiddleware from "../middlewares/validateKeyMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import cardSchema from "../schemas/cardSchema.js";

const cardsRouter = Router();
cardsRouter.post(
    "/cards",
    validateKeyMiddleware,
    validateSchemaMiddleware(cardSchema),
    postCard
);

export default cardsRouter;
