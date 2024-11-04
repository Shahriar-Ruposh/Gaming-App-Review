import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { trackUser } from "../middleware/trackUser.middleware";
import { createGameValidator, updateGameValidator } from "../validators/game.validators";
import { getAllGames, getGameById, getMyGames, getMyGameById, createGame, updateGame, deleteGame } from "../controllers/game.controller";

const router = Router();

router.get("/my-games", authenticate, getMyGames);
router.get("/my-games/:id", authenticate, getMyGameById);
// router.get("/elsearch", elsearch);

router.get("/", getAllGames);
router.get("/:id", trackUser, getGameById);

// router.post("/", createGameValidator, createGame);
router.post("/", createGame);
router.put("/:id", updateGameValidator, authenticate, updateGame);
router.delete("/:id", authenticate, deleteGame);

export default router;
