import express from "express";
import "express-async-errors";
import cors from "cors";
import router from "./routers/index.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on ${port}...`));
