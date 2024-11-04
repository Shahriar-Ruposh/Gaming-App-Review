import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface UserGameVisitsAttributes {
  id: string;
  user_id?: string | null;
  game_id: string | null;
  anon_id?: string | null;
  visited_at?: Date;
}

interface UserGameVisitsCreationAttributes extends Optional<UserGameVisitsAttributes, "id" | "user_id" | "game_id" | "anon_id"> {}

// Extend the Sequelize Model class
export class UserGameVisits extends Model<UserGameVisitsAttributes, UserGameVisitsCreationAttributes> implements UserGameVisitsAttributes {
  public id!: string;
  public user_id!: string | null;
  public game_id!: string | null;
  public anon_id!: string | null;
  public visited_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserGameVisits.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    game_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    anon_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visited_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "UserGameVisits",
    timestamps: true,
  }
);
