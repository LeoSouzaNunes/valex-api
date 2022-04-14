import { Router } from "express";

const router = Router();
router.get("/", (req, res) => res.send("Deploy realizado com sucesso..."));

export default router;
