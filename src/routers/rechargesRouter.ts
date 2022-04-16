import { Router } from "express";
import validateKeyMiddleware from "../middlewares/validateKeyMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import * as schemas from "../schemas/index.js";
import * as controller from "../controllers/rechargesController.js";

const rechargesRouter = Router();
rechargesRouter.post(
    "/recharges",
    validateKeyMiddleware,
    validateSchemaMiddleware(schemas.rechargeSchema),
    controller.postRecharge
);

export default rechargesRouter;
