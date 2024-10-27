import sequelize from "../config/db";
import { User } from "./user.model";
import Game from "./game.model";
import Genre from "./genre.model";
import GameGenre from "./gameGenres.model";
import Review from "./review.model";
import Favorite from "./favorite.model";
import UserGameVisit from "./userGameVisit.model";

// Relationships
Game.belongsTo(User, { foreignKey: "created_by" });
Review.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(Game, { foreignKey: "game_id" });
Favorite.belongsTo(User, { foreignKey: "user_id" });
Favorite.belongsTo(Game, { foreignKey: "game_id" });
UserGameVisit.belongsTo(User, { foreignKey: "user_id" });
UserGameVisit.belongsTo(Game, { foreignKey: "game_id" });

// Many-to-Many: Game and Genre through GameGenre
Game.belongsToMany(Genre, { through: GameGenre, foreignKey: "game_id" });
Genre.belongsToMany(Game, { through: GameGenre, foreignKey: "genre_id" });

const syncDb = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export { User, Game, Genre, GameGenre, Review, Favorite, UserGameVisit, syncDb };
