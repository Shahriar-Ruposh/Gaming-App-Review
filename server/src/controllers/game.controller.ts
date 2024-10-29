import { Request, Response } from "express";
import { Game, GameAttributes } from "../models/game.model";
import { Genre, GameGenre } from "../models";
import { Rating } from "../models/rating.model";
import { Comment } from "../models/comment.model";
import { User, UserAttributes } from "../models/user.model";
import { validationResult } from "express-validator";
import { Op, fn, col, literal } from "sequelize";

export const getAllGames = async (req: Request, res: Response) => {
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
            as: "Genres",
            where: { id: genre },
            through: { attributes: [] },
          },
        ],
      };
    }

    const games = await Game.findAll({
      where,
      ...genreFilter,
      limit: Number(limit),
      offset,
      include: [
        { model: Genre, as: "Genres", through: { attributes: [] } },
        {
          model: Rating,
          as: "Ratings",
          attributes: [],
        },
        {
          model: Comment,
          as: "Comments",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [fn("AVG", col("Ratings.rating")), "avg_user_rating"],
          [fn("COUNT", col("Comments.id")), "comment_count"],
        ],
      },
      group: ["Game.id", "Genres.id"],
      order: [["popularity_score", "DESC"]],
      subQuery: false,
    });

    // Calculate total games count based on filters without limit & offset
    const totalGamesCount = await Game.count({
      where,
      include: genre
        ? [
            {
              model: Genre,
              as: "Genres",
              where: { id: genre },
              through: { attributes: [] },
            },
          ]
        : undefined,
    });

    const totalPages = Math.ceil(totalGamesCount / Number(limit));

    res.json({
      games,
      currentPage: Number(page),
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const game = await Game.findOne({
      where: { id },
      include: [
        {
          model: Genre,
          as: "Genres",
          through: { attributes: [] },
        },
        {
          model: Rating,
          as: "Ratings",
          attributes: [],
        },
      ],
      attributes: {
        include: [[fn("AVG", col("Ratings.rating")), "avg_user_rating"]],
      },
      group: ["Game.id", "Genres.id"],
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createGame = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, release_date, publisher, thumbnail, genres } = req.body;
    const created_by = "09c6db90-fa4e-4d90-9e1b-d4e9e77df5f3";
    const game = await Game.create({ title, description, release_date, publisher, thumbnail, created_by } as GameAttributes);
    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGame = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { title, description, release_date, publisher, thumbnail } = req.body;
    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    game.title = title;
    game.description = description;
    game.release_date = release_date;
    game.publisher = publisher;
    game.thumbnail = thumbnail;
    await game.save();
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    await game.destroy();
    res.json({ message: "Game deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// try {
//   const { page = 1, limit = 5, search, genre, min_score, max_score } = req.query;

//   const offset = (Number(page) - 1) * Number(limit);
//   const where: any = {};

//   if (search) {
//     where.title = { [Op.iLike]: `%${search}%` };
//   }

//   if (min_score && max_score) {
//     where.avg_user_score = { [Op.between]: [Number(min_score), Number(max_score)] };
//   } else if (min_score) {
//     where.avg_user_score = { [Op.gte]: Number(min_score) };
//   } else if (max_score) {
//     where.avg_user_score = { [Op.lte]: Number(max_score) };
//   }

//   let genreFilter = {};
//   if (genre) {
//     genreFilter = {
//       include: [
//         {
//           model: Genre,
//           as: "Genres",
//           where: { id: genre },
//           through: { attributes: [] },
//         },
//       ],
//     };
//   }

//   const games = await Game.findAndCountAll({
//     where,
//     ...genreFilter,
//     limit: Number(limit),
//     offset,
//     include: [{ model: Genre, as: "Genres", through: { attributes: [] } }],
//     order: [["popularity_score", "DESC"]],
//   });

//   const totalPages = Math.ceil(games.count / Number(limit));

//   res.json({
//     games: games.rows,
//     currentPage: Number(page),
//     totalPages,
//   });
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ message: "Server error", error });
// }
