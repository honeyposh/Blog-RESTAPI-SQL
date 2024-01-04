const User = require("../models/userModel");
const Post = require("../models/postModel");
const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const Like = sequelize.define("likes", {
  user_id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  post_id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: Post,
      key: "id",
    },
  },
});
Like.belongsTo(User, { foreignKey: "user_id", as: "likedby" });
User.hasMany(Like, { foreignKey: "user_id", as: "likes" });
Like.belongsTo(Post, { foreignKey: "post_id" });
Post.hasMany(Like, { foreignKey: "post_id" });
// Like.removeAttribute("id");
module.exports = Like;
