import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getCommentsByGameId, createComment, deleteComment } from "../controllers/comment.controller";

const router = Router();

router.get("/games/:gameId/comments", getCommentsByGameId);

router.post("/games/:gameId/comments", authenticate, createComment);

router.delete("/comments/:commentId", authenticate, deleteComment);

export default router;
