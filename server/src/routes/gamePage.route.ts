import { Router } from "express";
import { listGames } from "../controllers/homePage.controller";

const router = Router();

router.get("/", listGames);

export default router;
