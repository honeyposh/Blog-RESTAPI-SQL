const errorResponse = require("../utils/errorResponse");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");
const sequelize = require("../utils/database");
exports.createPost = async (req, res, next) => {
  const { title, content, imageUrl } = req.body;
  // console.log(req.user.id);
  try {
    const post = await Post.create({
      title: title,
      content: content,
      imageUrl: imageUrl,
      postedBy: req.user.id,
    });
    await post.save();
    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};
exports.getPost = async (req, res, next) => {
  const post_Id = req.params.postId;
  try {
    const post = await Post.findByPk(post_Id);
    if (!post) {
      return next(new errorResponse("This post does not exist", 404));
    }
    const comments = await Comment.findAll({
      where: { postId: post_Id },
      include: [
        {
          model: User,
          as: "commenter",
          attributes: ["name"],
        },
      ],
    });
    const likes = await Like.findAll({
      where: { post_id: post_Id },
      include: [
        {
          model: User,
          as: "likedby",
          attributes: ["name"],
        },
      ],
    });
    const comment = comments.map((comment) => ({
      text: comment.text,
      commentedBy: comment.commenter.name,
    }));
    const like = likes.map((like) => ({
      likedBy: like.likedby.name,
    }));
    // console.log(comment);
    const postdata = { ...post.dataValues, comment, like };
    res.status(200).json({ success: true, post: postdata });
  } catch (error) {
    next(error);
  }
};
exports.getPosts = async (req, res, next) => {
  try {
    let posts = await Post.findAll({
      include: [
        { model: User, as: "poster", attributes: ["name"] },
        {
          model: Comment,
          include: {
            model: User,
            as: "commenter",
            attributes: ["name"],
          },
        },
        {
          model: Like,
          as: "likes",
          include: {
            model: User,
            as: "likedby",
            attributes: ["name"],
          },
        },
      ],
    });
    const postData = posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        postedBy: post.poster.name,
        comments: post.comments.map((comment) => ({
          text: comment.text,
          commenteBy: comment.commenter.name,
          created: comment.created,
        })),
        likes: post.likes
          .map((like) => (like.likedby ? like.likedby.name : null))
          .filter(Boolean),
      };
    });
    res.status(200).json({ success: true, postData });
  } catch (error) {
    next(error);
  }
};
exports.addLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findByPk(postId);

    if (!post) {
      return next(new errorResponse("This post does not exist", 404));
    }

    const like = await Like.findOne({
      where: { user_id: userId, post_id: postId },
    });
    if (like) {
      await like.destroy();
    }
    const createLike = await Like.create({ user_id: userId, post_id: postId });
    res.status(201).json({
      status: "true",
      createLike,
    });
  } catch (error) {
    next(error);
  }
};
exports.addComment = async (req, res, next) => {
  try {
    const text = req.body.text;
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);
    if (!post) {
      return next(new errorResponse("This post does not exist", 404));
    }
    const comment = await Comment.create({
      text: text,
      commentedBy: req.user.id,
      postId: postId,
    });
    res.status(200).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const post = await Post.findByPk(req.params.postId, { transaction });
      if (!post) {
        return next(new errorResponse("post not found", 404));
      }
      const comments = await post.getComments({ transaction });
      if (!comments.length) {
        console.log("No comments to delete");
      }
      const likes = await post.getLikes({ transaction });
      // console.log(likes);
      if (!likes.length) {
        console.log("No likes to delete");
      }
      if (comments.length) {
        for (const comment of comments) {
          await comment.destroy({ transaction });
        }
      }
      if (likes.length) {
        for (const like of likes) {
          await like.destroy({ transaction });
        }
      }
      await post.destroy({ transaction });
    });
    res.status(200).json({
      success: true,
      message: "successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
exports.removeLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const like = await Like.findOne({
      where: { user_id: userId, post_id: postId },
    });
    if (!like) {
      return next(new errorResponse("post do not have like", 404));
    }
    await like.destroy();
    res.status(200).json({ success: true, message: "successfully deleted" });
  } catch (error) {
    next(error);
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const comment = await Comment.findOne({
      where: { id: commentId, postId: postId },
    });
    console.log(comment);
    if (
      comment.commentedBy.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new errorResponse("You cannot delete this post", 403));
    }
    await comment.destroy();
    res.status(200).json({ success: true, message: "successfully deleted" });
  } catch (error) {
    next(error);
  }
};
exports.updatePost = async (req, res, next) => {
  try {
    const { title, content, imageUrl } = req.body;
    const post = await Post.findByPk(req.params.postId);
    if (!post) {
      return next(new errorResponse("post not found", 404));
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    await post.save();
    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
