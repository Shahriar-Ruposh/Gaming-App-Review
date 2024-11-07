// game.route.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { trackUser } from "../middleware/trackUser.middleware";
import { createGameValidator, updateGameValidator } from "../validators/game.validators";
import { getAllGames, getGameById, getMyGames, getMyGameById, createGame, updateGame, deleteGame, elsearch } from "../controllers/game.controller";
import upload from "../config/upload";

const router = Router();

router.get("/my-games", authenticate, getMyGames);
router.get("/my-games/:id", authenticate, getMyGameById);
router.get("/elsearch", elsearch);

router.get("/", getAllGames);
router.get("/:id", trackUser, getGameById);

router.post("/", authenticate, upload.single("thumbnail"), createGame); // Use `upload` instance from upload.ts
router.put("/:id", authenticate, upload.single("thumbnail"), updateGame);
router.delete("/:id", authenticate, deleteGame);

export default router;
