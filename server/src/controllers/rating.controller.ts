import { Request, Response } from "express";
import { Rating } from "../models/rating.model";
import { Game } from "../models/game.model";
import { User } from "../models/user.model";

export const getRatingsByGameId = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;

    const ratings = await Rating.findAll({
      where: { game_id: gameId },
      include: [{ model: User, attributes: ["id", "name"] }],
    });

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const createRating = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    let { rating } = req.body;
    const userId = req.user?.userId?.toString();
    if (!userId || !gameId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }
    rating = Math.floor(rating);
    const userRating = await Rating.findOne({ where: { user_id: userId } });
    if (userRating) {
      if (userRating.game_id === gameId) {
        userRating.rating = rating;
        await userRating.save();
        return res.status(200).json({ message: "Rating updated successfully", rating: userRating.rating });
      }
    }
    const newRating = await Rating.create({
      game_id: gameId,
      user_id: userId,
      rating,
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const { ratingId } = req.params;

    const userId = req.user?.userId.toString();

    const rating = await Rating.findByPk(ratingId);

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (rating.user_id !== userId) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await rating.destroy();
    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
