import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import { Game } from "./game.model";

interface RatingAttributes {
  id: string;
  game_id: string;
  user_id: string;
  rating: number;
  created_at: Date;
}

interface RatingCreationAttributes extends Optional<RatingAttributes, "id"> {}

class Rating extends Model<RatingAttributes, RatingCreationAttributes> implements RatingAttributes {
  public id!: string;
  public game_id!: string;
  public user_id!: string;
  public rating!: number;
  public readonly created_at!: Date;
}

Rating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Game,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Rating",
    timestamps: false,
  }
);

export { Rating, RatingAttributes };
