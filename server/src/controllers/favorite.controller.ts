import { Request, Response } from "express";
import { Favorite } from "../models/favorite.model";
import { Game } from "../models/game.model";
import { User } from "../models/user.model";

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { game_id } = req.body;
    const userId = req.user?.userId.toString();
    const game = await Game.findByPk(game_id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    const favorite = await Favorite.findOne({
      where: {
        user_id: userId,
        game_id: game_id,
      },
    });
    if (favorite) {
      return res.status(400).json({ error: "Game already added to favorites" });
    }
    const newFavorite = await Favorite.create({
      user_id: userId,
      game_id: game_id,
    });
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId.toString();
    const favorites = await Favorite.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Game,
          as: "Game",
        },
      ],
    });
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const { favoriteId } = req.params;
    const favorite = await Favorite.findByPk(favoriteId);
    if (!favorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    await favorite.destroy();
    res.json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
