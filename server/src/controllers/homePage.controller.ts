import { Request, Response } from "express";
import { Op } from "sequelize";
import { Game, Genre, GameGenre } from "../models"; // Adjust based on your model imports

export const listGames = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, search, genre, min_score, max_score } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    if (min_score && max_score) {
      where.avg_user_score = { [Op.between]: [Number(min_score), Number(max_score)] };
    } else if (min_score) {
      where.avg_user_score = { [Op.gte]: Number(min_score) };
    } else if (max_score) {
      where.avg_user_score = { [Op.lte]: Number(max_score) };
    }

    let genreFilter = {};
    if (genre) {
      genreFilter = {
        include: [
          {
            model: Genre,
            as: "Genres", // <-- This must match the alias defined in the association
            where: { id: genre },
            through: { attributes: [] },
          },
        ],
      };
    }

    const games = await Game.findAndCountAll({
      where,
      ...genreFilter,
      limit: Number(limit),
      offset,
      include: [{ model: Genre, as: "Genres", through: { attributes: [] } }], // Corrected alias
      order: [["popularity_score", "DESC"]],
    });

    const totalPages = Math.ceil(games.count / Number(limit));

    res.json({
      games: games.rows,
      currentPage: Number(page),
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
