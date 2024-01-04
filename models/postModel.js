const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = require("../models/userModel");
const Post = sequelize.define("post", {
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postedBy: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});
User.hasOne(Post, { foreignKey: "postedBy", as: "poster" });
Post.belongsTo(User, { foreignKey: "postedBy", as: "poster" });
// likes: {
//   type: DataTypes.ARRAY(DataTypes.INTEGER),
//   allowNull: true,
// },
module.exports = Post;
