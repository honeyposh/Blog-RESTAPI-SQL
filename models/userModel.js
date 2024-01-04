const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = sequelize.define("user", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(32),
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notNull: { msg: "Name is required" },
      len: { max: 32 },
    },
  },
  username: {
    type: DataTypes.STRING(32),
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "username is required" },
      len: { max: 32 },
    },
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: {
      notNull: { msg: "password is required" },
      len: { min: 6 },
    },
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
});
module.exports = User;
