// server.ts
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import gameRoutes from "./routes/game.route";
import genreRoutes from "./routes/genre.route";
import ratingRoutes from "./routes/rating.route";
import commentRoutes from "./routes/comment.route";
import { syncDb } from "./models";
import createGameIndex from "./elasticsearchSetup";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log(path.join(__dirname, "../uploads"));

// Add routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api", ratingRoutes);
app.use("/api", commentRoutes);

syncDb().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, async () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    try {
      await createGameIndex();
    } catch (err) {
      console.log(err);
    }
  });
});
