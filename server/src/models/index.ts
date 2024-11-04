import sequelize from "../config/db";
import { User } from "./user.model";
import { Game } from "./game.model";
import { Genre } from "./genre.model";
import { GameGenre } from "./gameGenres.model";
import { Rating } from "./rating.model";
import { Comment } from "./comment.model";
import { Favorite } from "./favorite.model";
import { UserGameVisits } from "./userGameVisit.model";

// Define relationships
Game.belongsTo(User, { foreignKey: "created_by" });
Rating.belongsTo(User, { foreignKey: "user_id" });
Rating.belongsTo(Game, { foreignKey: "game_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });
Comment.belongsTo(Game, { foreignKey: "game_id" });
Favorite.belongsTo(User, { foreignKey: "user_id" });
Favorite.belongsTo(Game, { foreignKey: "game_id" });
UserGameVisits.belongsTo(User, { foreignKey: "user_id" });
UserGameVisits.belongsTo(Game, { foreignKey: "game_id" });

// Many-to-Many: Game and Genre through GameGenre
Game.belongsToMany(Genre, { through: GameGenre, foreignKey: "game_id" });
Genre.belongsToMany(Game, { through: GameGenre, foreignKey: "genre_id" });

// Add hasMany associations
Game.hasMany(Rating, { foreignKey: "game_id", as: "Ratings" });
Game.hasMany(Comment, { foreignKey: "game_id", as: "Comments" });

const syncDb = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export { User, Game, Genre, GameGenre, Rating, Comment, Favorite, UserGameVisits, syncDb };
