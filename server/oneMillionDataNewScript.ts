// try {
//   const { page, limit, search, min_score, max_score } = req.query;
//   console.log(limit);
//   let { genre } = req.query;

//   const offset = (Number(page) - 1) * Number(limit);
//   console.log("????????????????????????????????????", offset);
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

//   if (genre && typeof genre === "string") {
//     genre.toString().toLowerCase();
//     if (genre === "all-games") {
//       genre = undefined;
//     }
//   }

//   const genreWhere = genre ? { name: { [Op.iLike]: `%${genre}%` } } : undefined;

//   const games = await Game.findAll({
//     where,
//     limit: Number(limit),
//     offset,
//     include: [
//       {
//         model: Genre,
//         as: "Genres",
//         through: { attributes: [] },
//         where: genreWhere,
//       },
//       {
//         model: Rating,
//         as: "Ratings",
//         attributes: [],
//       },
//       {
//         model: Comment,
//         as: "Comments",
//         attributes: [],
//       },
//     ],
//     attributes: {
//       include: [
//         [fn("AVG", col("Ratings.rating")), "avg_user_rating"],
//         [fn("COUNT", col("Comments.id")), "comment_count"],
//       ],
//     },
//     group: ["Game.id", "Genres.id"],
//     order: [["avg_user_rating", "ASC"]],
//     subQuery: false,
//   });

//   const totalGamesCount = await Game.count({
//     where,
//     include: genre
//       ? [
//           {
//             model: Genre,
//             as: "Genres",
//             where: genreWhere,
//             through: { attributes: [] },
//           },
//         ]
//       : undefined,
//   });

//   const totalPages = Math.ceil(totalGamesCount / Number(limit));

//   res.json({
//     games,
//     currentPage: Number(page),
//     totalPages,
//   });
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ message: "Server error", error });
// }
