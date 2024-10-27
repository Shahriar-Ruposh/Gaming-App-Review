import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

interface GameGenreAttributes {
  game_id: string;
  genre_id: string;
}

class GameGenre extends Model<GameGenreAttributes> implements GameGenreAttributes {
  public game_id!: string;
  public genre_id!: string;
}

GameGenre.init(
  {
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    genre_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: "GameGenre",
    timestamps: false,
  }
);

export default GameGenre;
