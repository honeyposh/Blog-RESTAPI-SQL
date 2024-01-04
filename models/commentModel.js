const User = require("../models/userModel");
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Post = require("../models/postModel");
const Comment = sequelize.define("comment", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  commentedBy: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});
// User.hasOne(Post, { foreignKey: "postedBy" });
// Post.belongsTo(User, { foreignKey: "postedBy" });
Post.hasMany(Comment, { foreignKey: "postId" });
// Comment.belongTo(Post,{foreignKey:"postId"})
Comment.belongsTo(User, { foreignKey: "commentedBy", as: "commenter" });
// User.hasMany(Comment,{foreignKey:"postedBy"})
module.exports = Comment;
