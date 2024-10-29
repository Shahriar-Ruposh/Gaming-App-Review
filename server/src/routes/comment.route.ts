import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getCommentsByGameId, createComment, deleteComment } from "../controllers/comment.controller";

const router = Router();

router.get("/games/:gameId/reviews", authenticate, getCommentsByGameId);

router.post("/games/:gameId/reviews", authenticate, createComment);

router.delete("/reviews/:reviewId", authenticate, deleteComment);

export default router;
