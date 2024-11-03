import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getAllGenres, createGenre, updateGenre, deleteGenre } from "../controllers/genre.controller";

const router = Router();

router.get("/", getAllGenres);

router.post("/", createGenre);

router.put("/:id", authenticate, updateGenre);

router.delete("/:id", authenticate, deleteGenre);

export default router;
