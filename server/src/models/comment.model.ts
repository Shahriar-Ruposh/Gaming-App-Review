import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface CommentAttributes {
  id: string;
  game_id: string;
  user_id: string;
  comment: string;
  created_at: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: string;
  public game_id!: string;
  public user_id!: string;
  public comment!: string;
  public readonly created_at!: Date;
}

Comment.init(
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
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    timestamps: false,
  }
);

export { Comment, CommentAttributes };
