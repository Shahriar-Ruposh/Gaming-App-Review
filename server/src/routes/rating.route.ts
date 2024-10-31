import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getRatingsByGameId, createRating, deleteRating } from "../controllers/rating.controller";

const router = Router();

router.get("/games/:gameId/ratings", getRatingsByGameId);

router.post("/games/:gameId/ratings", authenticate, createRating);

router.delete("/ratings/:ratingId", authenticate, deleteRating);

export default router;
