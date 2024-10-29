import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
interface GameAttributes {
  id: string;
  title: string;
  description?: string;
  release_date?: Date;
  publisher?: string;
  thumbnail?: string;
  popularity_score: number;
  trending_score: number;
  created_by: string;
}

interface GameCreationAttributes extends Optional<GameAttributes, "id" | "description" | "release_date" | "publisher" | "thumbnail"> {}

class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public release_date?: Date;
  public publisher?: string;
  public thumbnail?: string;
  public popularity_score!: number;
  public trending_score!: number;
  public created_by!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Game.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    release_date: {
      type: DataTypes.DATE,
    },
    publisher: {
      type: DataTypes.STRING,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },

    popularity_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    trending_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Game",
  }
);

export { Game, GameAttributes };
