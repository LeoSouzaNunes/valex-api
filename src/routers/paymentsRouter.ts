import { Router } from "express";
import * as controllers from "../controllers/paymentsController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import * as schemas from "../schemas/index.js";

const paymentsRouter = Router();
paymentsRouter.post(
    "/payments",
    validateSchemaMiddleware(schemas.paymentSchema),
    controllers.postPayment
);

export default paymentsRouter;
