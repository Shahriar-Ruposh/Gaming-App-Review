import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Game route" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "Single Game route" });
});

router.post("/:id", authenticate, (req, res) => {
  res.json({ message: "Create Game route" });
});

router.put("/:id", authenticate, (req, res) => {
  res.json({ message: "Update Game route" });
});

router.delete("/:id", authenticate, (req, res) => {
  res.json({ message: "Delete Game route" });
});

export default router;
