import express from "express";
import cors from "cors";
const { syncDb } = require("./models");
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import gameRoutes from "./routes/game.route";
import genreRoutes from "./routes/genre.route";
import ratingRoutes from "./routes/rating.route";
import commentRoutes from "./routes/comment.route";

dotenv.config();

const app = express();

// app.use(
//   cors({
//     // origin: process.env.CORS_ORIGIN || "http://localhost:3000",
//     credentials: true,
//   })
// );
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

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api", ratingRoutes);
app.use("/api", commentRoutes);

syncDb().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
});
