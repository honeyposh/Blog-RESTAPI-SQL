const Sequelize = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    dialect: "mysql",
    port: 3306,
    host: process.env.HOST,
  }
);

module.exports = sequelize;
