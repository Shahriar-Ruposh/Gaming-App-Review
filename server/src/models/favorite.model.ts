import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface FavoriteAttributes {
  id: string;
  user_id: string;
  game_id: string;
  created_at: Date;
}

interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, "id"> {}

class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
  public id!: string;
  public user_id!: string;
  public game_id!: string;
  public created_at!: Date;
}

Favorite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    timestamps: false,
  }
);

export { Favorite, FavoriteAttributes };
