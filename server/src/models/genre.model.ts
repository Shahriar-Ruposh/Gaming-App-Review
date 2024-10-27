import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface GenreAttributes {
  id: string;
  name: string;
}

interface GenreCreationAttributes extends Optional<GenreAttributes, "id"> {}

class Genre extends Model<GenreAttributes, GenreCreationAttributes> implements GenreAttributes {
  public id!: string;
  public name!: string;
}

Genre.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Genre",
  }
);

export default Genre;
