import { Router } from "express";
import * as controller from "../controllers/cardsController.js";
import ensureNumberOnParamsMiddleware from "../middlewares/ensureNumberOnParamsMiddleware.js";
import validateKeyMiddleware from "../middlewares/validateKeyMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import * as schemas from "../schemas/index.js";

const cardsRouter = Router();
cardsRouter.post(
    "/cards",
    validateKeyMiddleware,
    validateSchemaMiddleware(schemas.cardSchema),
    controller.postCard
);

cardsRouter.get(
    "/cards/:employeeId",
    ensureNumberOnParamsMiddleware("employeeId"),
    controller.getCards
);

cardsRouter.get(
    "/cards/:cardId/trades",
    ensureNumberOnParamsMiddleware("cardId"),
    controller.getCardTrades
);

cardsRouter.put(
    "/cards/:cardId",
    ensureNumberOnParamsMiddleware("cardId"),
    validateSchemaMiddleware(schemas.activationCardSchema),
    controller.updateCard
);
export default cardsRouter;
