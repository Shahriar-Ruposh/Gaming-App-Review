const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("Game_Review_Test_1", "root", "asdf;lkj", {
  host: "localhost",
  dialect: "postgres",
});
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: "postgres",
// });

// const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: "localhost",
//   username: "root",
//   password: "asdf;lkj",
//   database: "Game_Review_App_Test",
//   logging: false, // Disable logging
// });

export default sequelize;
