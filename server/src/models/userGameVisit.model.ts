import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

// Define attributes for the UserGameVisit model
interface UserGameVisitAttributes {
  id: string;
  user_id: string;
  game_id: string;
  visit_date: Date;
}

// Define optional attributes for creation (ID will be auto-generated)
interface UserGameVisitCreationAttributes extends Optional<UserGameVisitAttributes, "id"> {}

class UserGameVisit extends Model<UserGameVisitAttributes, UserGameVisitCreationAttributes> implements UserGameVisitAttributes {
  public id!: string;
  public user_id!: string;
  public game_id!: string;
  public visit_date!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the UserGameVisit model
UserGameVisit.init(
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
    visit_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserGameVisit",
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`
  }
);

export default UserGameVisit;
