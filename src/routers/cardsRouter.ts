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
    "/cards/:cardId/unblock",
    ensureNumberOnParamsMiddleware("cardId"),
    validateSchemaMiddleware(schemas.passwordSchema),
    controller.unblockCard
);

cardsRouter.put(
    "/cards/:cardId/block",
    ensureNumberOnParamsMiddleware("cardId"),
    validateSchemaMiddleware(schemas.passwordSchema),
    controller.blockCard
);

cardsRouter.put(
    "/cards/:cardId",
    ensureNumberOnParamsMiddleware("cardId"),
    validateSchemaMiddleware(schemas.activationCardSchema),
    controller.activateCard
);

cardsRouter.post(
    "/cards/online",
    validateSchemaMiddleware(schemas.onlineCardSchema),
    controller.postOnlineCard
);

cardsRouter.delete(
    "/cards/online/:cardId",
    validateSchemaMiddleware(schemas.passwordSchema),
    ensureNumberOnParamsMiddleware("cardId"),
    controller.deleteOnlineCard
);

export default cardsRouter;
