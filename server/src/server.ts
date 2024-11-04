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
import session from "express-session";
// import { createGameIndex } from "./elasticsearchSetup";
// import oneMillionDataRoute from "./routes/oneMillion.route";

dotenv.config();

const app = express();

// Set up Redis session store (optional, but recommended for production)
// const RedisStore = connectRedis(session);
// const redisClient = new Redis();

// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       httpOnly: true,
//       maxAge: null,
//     },
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

// app.use("/api/oneMillionDataInput", oneMillionDataRoute);
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api", ratingRoutes);
app.use("/api", commentRoutes);

syncDb().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, async () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    // await createGameIndex();
  });
});
