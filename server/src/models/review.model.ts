import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface ReviewAttributes {
  id: string;
  game_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, "id" | "comment"> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: string;
  public game_id!: string;
  public user_id!: string;
  public rating!: number;
  public comment?: string;
  public readonly created_at!: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Review",
    timestamps: false,
  }
);

export { Review, ReviewAttributes };
