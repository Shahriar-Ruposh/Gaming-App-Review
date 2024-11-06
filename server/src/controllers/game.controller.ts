import { Request, Response } from "express";
import { Game, GameAttributes } from "../models/game.model";
import { Genre, GameGenre, UserGameVisits } from "../models";
import { Rating } from "../models/rating.model";
import { Comment } from "../models/comment.model";
import { User, UserAttributes } from "../models/user.model";
import { validationResult } from "express-validator";
import { Op, fn, col, literal } from "sequelize";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import cookie from "cookie";
import session from "express-session";
import client from "../config/elasticSearch";
// import client from "../config/elasticSearch";

declare module "express-session" {
  interface Session {
    anonId?: string;
  }
}

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, min_score, max_score } = req.query;
    console.log(limit);
    let { genre } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    console.log("????????????????????????????????????", offset);
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

    if (genre && typeof genre === "string") {
      genre.toString().toLowerCase();
      if (genre === "all-games") {
        genre = undefined;
      }
    }

    const genreWhere = genre ? { name: { [Op.iLike]: `%${genre}%` } } : undefined;

    const games = await Game.findAll({
      where,
      limit: Number(limit),
      offset,
      include: [
        {
          model: Genre,
          as: "Genres",
          through: { attributes: [] },
          where: genreWhere,
        },
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
      order: [["avg_user_rating", "ASC"]],
      subQuery: false,
    });

    const totalGamesCount = await Game.count({
      where,
      include: genre
        ? [
            {
              model: Genre,
              as: "Genres",
              where: genreWhere,
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
    const userId = req.user?.userId?.toString() || null;

    console.log(">>>>>>>>>>>>>>>>>>>>Cookies:", req.cookies);

    let anonId = req.cookies.anonId;
    if (!userId && !anonId) {
      anonId = uuidv4();
      res.cookie("anonId", anonId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
    console.log(">>>>>>>>>>>>>>>>>>>Setting cookie:", anonId);

    console.log(">>>>>>>>>>>>>>>>User ID:", userId);
    console.log(">>>>>>>>>>>>>>>>>Anonymous ID (cookie):", anonId);

    const visitCondition = {
      game_id: id,
      ...(userId ? { user_id: userId } : { anon_id: anonId }),
    };

    const existingVisit = await UserGameVisits.findOne({
      where: visitCondition,
    });

    console.log("Existing Visit:", existingVisit ? "Found" : "Not Found");

    if (!existingVisit) {
      await UserGameVisits.create({
        game_id: id,
        user_id: userId,
        anon_id: anonId,
      });

      await Game.increment("view_count", { where: { id } });
      console.log("View count incremented for game:", id);
    }

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

export const getMyGames = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, min_score, max_score } = req.query;
    let { genre } = req.query;
    let userId = req.user?.userId.toString();

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

    if (genre && typeof genre === "string") {
      genre.toString().toLowerCase();
      if (genre === "all-games") {
        genre = undefined;
      }
    }

    const genreWhere = genre ? { name: { [Op.iLike]: `%${genre}%` } } : undefined;

    const games = await Game.findAll({
      where: { created_by: userId },
      limit: Number(limit),
      offset,
      include: [
        {
          model: Genre,
          as: "Genres",
          through: { attributes: [] },
          where: genreWhere,
        },
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
      order: [["avg_user_rating", "ASC"]],
      subQuery: false,
    });

    const totalGamesCount = await Game.count({
      where,
      include: genre
        ? [
            {
              model: Genre,
              as: "Genres",
              where: genreWhere,
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

export const getMyGameById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId.toString();
    const { id } = req.params;
    const games = await Game.findAll({
      where: { id, created_by: userId },
      include: [{ model: Genre, as: "Genres", through: { attributes: [] } }],
    });
    if (!games) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createGame = async (req: Request, res: Response) => {
  try {
    let { title, description, release_date, publisher, genres } = req.body;
    const userId = req.user?.userId.toString();

    if (!genres || genres.length === 0) {
      return res.status(400).json({ error: "At least one genre is required" });
    }

    // If genres is a string, parse it into an array
    if (typeof genres === "string") {
      genres = JSON.parse(genres);
    }

    const newReleaseDate = new Date(release_date);
    release_date = newReleaseDate.toISOString();

    // Handle thumbnail
    //@ts-ignore
    const thumbnailPath = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>", thumbnailPath);

    const game = await Game.create({
      title,
      description,
      release_date,
      publisher,
      thumbnail: thumbnailPath,
      created_by: userId,
    });

    for (const genreId of genres) {
      await GameGenre.create({ game_id: game.id, genre_id: genreId });
    }

    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createGameCustom = async (req: Request, res: Response) => {
  console.log("this is hit");
  try {
    let { title, description, release_date, publisher, thumbnail, genres, userId } = req.body;

    if (!genres || genres.length === 0) {
      return res.status(400).json({ error: "At least one genre is required" });
    }

    console.log("this is hit 2");
    const newReleaseDate = new Date(release_date);
    release_date = newReleaseDate.toISOString();
    const created_by = userId;
    console.log("this is hit 3");

    const game = await Game.create({ title, description, release_date, publisher, thumbnail, created_by } as GameAttributes);
    console.log("this is hit 4");

    for (let i = 0; i < genres.length; i++) {
      await GameGenre.create({ game_id: game.id, genre_id: genres[i] });
    }

    const genreRecords = await Genre.findAll({
      where: { id: genres },
      attributes: ["name"],
    });
    const genreNames = genreRecords.map((genre) => genre.name);

    // Index the game in Elasticsearch with genre names
    await client.index({
      index: "games",
      id: game.id,
      body: {
        title,
        description,
        release_date,
        publisher,
        thumbnail,
        genres: genreNames, // Store genre names instead of IDs
        created_by,
        view_count: game.view_count,
        popularity_score: game.popularity_score,
        trending_score: game.trending_score,
      },
    });
    console.log("Game indexed in Elasticsearch");

    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

// export const createGame = async (req: Request, res: Response) => {
//   // console.log("this is hit");
//   // const errors = validationResult(req);
//   // if (!errors.isEmpty()) {
//   //   return res.status(400).json({ errors: errors.array() });
//   // }
//   console.log("this is hit");
//   try {
//     // const userId = req.user?.userId.toString();
//     let { title, description, release_date, publisher, thumbnail, genres, userId } = req.body;
//     if (!genres || genres.length === 0) {
//       return res.status(400).json({ error: "At least one genre is required" });
//     }
//     console.log("this is hit 2");
//     const newReleaseDate = new Date(release_date);
//     release_date = newReleaseDate.toISOString();
//     const created_by = userId;
//     console.log("this is hit 3");
//     console.log("title:>>>>", title, "description:>>>>", description, "release_date:>>>>", release_date, "publisher:>>>>", publisher, "thumbnail:>>>>", thumbnail, "created_by:>>>>", created_by, "genres:>>>>", genres);
//     const game = await Game.create({ title, description, release_date, publisher, thumbnail, created_by } as GameAttributes);
//     console.log("this is hit 4");

//     for (let i = 0; i < genres.length; i++) {
//       const gameGenre = await GameGenre.create({ game_id: game.id, genre_id: genres[i] });
//     }
//     // await client.index({
//     //   index: "games",
//     //   id: game.id,
//     //   body: game.toJSON(),
//     // });

//     res.status(201).json(game);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getGameById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const game = await Game.findOne({
//       where: { id },
//       include: [
//         {
//           model: Genre,
//           as: "Genres",
//           through: { attributes: [] },
//         },
//         {
//           model: Rating,
//           as: "Ratings",
//           attributes: [],
//         },
//       ],
//       attributes: {
//         include: [[fn("AVG", col("Ratings.rating")), "avg_user_rating"]],
//       },
//       group: ["Game.id", "Genres.id"],
//     });

//     if (!game) {
//       return res.status(404).json({ error: "Game not found" });
//     }

//     res.json(game);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const elsearch = async (req: Request, res: Response) => {
  const title = "Recycled Fresh Mouse";
  if (!title) {
    return res.status(400).json({ error: "Title query parameter is required" });
  }

  try {
    const response = await client.search({
      index: "games",
      query: {
        match: {
          title: title,
        },
      },
    });

    res.status(200).json({
      message: "Search results",
      data: response.hits.hits,
    });
  } catch (error) {
    console.error("Error performing search in Elasticsearch:", error);
    res.status(500).json({
      message: "Failed to search in Elasticsearch",
      error: error.message,
    });
  }
};

// const generateRandomData = async () => {
//   const userIds = [
//     "b3f9df2c-dcd1-42ce-ad46-298c94e3a9b6",
//     "ea4c8d4f-8fa7-4d60-b36e-62673e84a650",
//     "f813c00e-d582-4e3b-b4af-17eab311ba89",
//     "a2841db9-dd4c-4c4f-a4ee-bcfb33392da4",
//     "15a8651a-f95a-442b-ba10-909042c6baf1",
//     "f0d1761b-2b2c-4bad-9974-479aaf79cc2d",
//     "2a004e10-2eac-4157-9b6e-2f6bedbaf359",
//     "b7075586-a4e2-4377-9b56-0e312e5d4adf",
//   ];

//   const genreIds = [
//     "878230a8-6d9e-458a-9eba-d22a90ab1a1d",
//     "bf5e554d-dff0-40a8-9f41-1b854b039393",
//     "21bdb2df-6d29-4dfb-b480-3c3a969d0385",
//     "222d562d-d183-4e0e-a709-401305a6ede4",
//     "d6ac2a79-96ee-40c6-a074-6250f60c90f6",
//     "0b2b1702-b685-4986-a6c6-83dc6729db0a",
//     "fc0c80fb-5071-43c2-9b13-bfa6b48e86aa",
//     "37f2ac45-7330-4496-9143-0f672e31e158",
//     "c76dd6bb-3007-4f04-8082-a1a059d1ea7b",
//     "8270887c-2c41-49c2-8de8-ef8a7573c3d7",
//     "be92d490-71dd-4003-9d54-146e853bea4a",
//   ];

//   const randomIndex = Math.floor(Math.random() * userIds.length);
//   const userId = userIds[randomIndex];
//   const shuffledGenres = genreIds.sort(() => 0.5 - Math.random());
//   const count = Math.floor(Math.random() * 2) + 2;
//   const selectedGenres = shuffledGenres.slice(0, count);

//   console.log("userId:>>>>>", userId);
//   console.log("shuffledGenres:>>>>>>>", selectedGenres);
//   const title = faker.commerce.productName();
//   const description = faker.lorem.paragraph();
//   const release_date = faker.date.past();
//   const publisher = faker.company.name();
//   const thumbnail = faker.image.url();
//   const created_by = userId;

//   try {
//     const game = await Game.create({ title, description, release_date, publisher, thumbnail, created_by } as GameAttributes);

//     // Check if the game was created successfully
//     if (!game) {
//       throw new Error("Game was not created properly");
//     }
//     console.log(game);
//     for (let i = 0; i < selectedGenres.length; i++) {
//       console.log("selectedGenres[i]:::>>>>", selectedGenres[i]);
//       console.log("first game.id:::>>>>", game.id); // Should now be defined
//       await GameGenre.create({ game_id: game.id, genre_id: selectedGenres[i] });
//     }
//     return true;
//   } catch (error) {
//     console.error("Error creating game or game genres:", error);
//     return false;
//   }
// };

// export const createOneMillionData = async (req: Request, res: Response) => {
//   // Predefined user and genre IDs

//   for (let i = 0; i < 1; i++) {
//     const result = await generateRandomData();
//     if (!result) {
//       console.log(`Failed to generate game ${i + 1}`);
//     } else {
//       console.log(`Game ${i + 1} generated successfully`);
//     }
//   }
// };

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

// const games = await Game.findAll({
//   attributes: {
//     include: [
//       [
//         Sequelize.literal(`(SELECT AVG("rating") FROM "Ratings" WHERE "Ratings"."game_id" = "Game"."id")`),
//         'avg_user_rating'
//       ],
//       [
//         Sequelize.literal(`(SELECT COUNT("id") FROM "Comments" WHERE "Comments"."game_id" = "Game"."id")`),
//         'comment_count'
//       ]
//     ]
//   },
//   include: [
//     {
//       model: Genre,
//       attributes: ['id', 'name'],
//       through: { attributes: [] }  // Skip the junction table attributes
//     }
//   ],
//   order: [[Sequelize.literal('avg_user_rating'), 'ASC']],  // Ordering by avg_user_rating literal
//   limit: 50,
//   offset: 0
// });
