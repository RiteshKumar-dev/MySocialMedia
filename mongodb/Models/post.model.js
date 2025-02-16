import mongoose from 'mongoose';
import { Comment } from '../Models/Comment.model.js';

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    imageUrl: { type: String },
    imagePublicId: { type: String }, // Cloudinary Image ID
    isArticle: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: [] }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true }
);

// ✅ Like or Unlike a Post
PostSchema.statics.toggleLike = async function (postId, userId) {
  try {
    const post = await this.findById(postId);
    if (!post) throw new Error('Post not found');

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    return { success: true, message: isLiked ? 'Post unliked' : 'Post liked', post };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Remove a Post and Its Comments
PostSchema.statics.deletePost = async function (postId) {
  try {
    const post = await this.findById(postId);
    if (!post) throw new Error('Post not found');

    await Comment.deleteMany({ _id: { $in: post.comments } });
    await post.deleteOne();
    return { success: true, message: 'Post and related comments deleted' };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Add a Comment to a Post
PostSchema.statics.addComment = async function (postId, commentData) {
  try {
    const post = await this.findById(postId);
    if (!post) throw new Error('Post not found');
    const comment = await Comment.create(commentData);
    post.comments.push(comment._id);
    await post.save();
    return { success: true, message: 'Comment added', comment };
  } catch (error) {
    throw new Error(error.message);
  }
};
// ✅ Delete a Comment from a Post
PostSchema.statics.deleteComment = async function (postId, commentId) {
  try {
    const post = await this.findById(postId);
    if (!post) throw new Error('Post not found');

    post.comments = post.comments.filter((id) => id.toString() !== commentId.toString());
    await post.save();

    await Comment.findByIdAndDelete(commentId);

    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get All Posts with Populated Data
PostSchema.statics.getAllPosts = async function () {
  try {
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: 'firstname lastname avatar bio profession',
      })
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'firstname lastname avatar' },
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    return { success: true, posts };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get All Comments on a Specific Post
PostSchema.statics.getAllComments = async function (postId) {
  try {
    const post = await this.findById(postId)
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'firstname lastname avatar' },
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    if (!post) throw new Error('Post not found');
    return { success: true, comments: post.comments };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get Total Likes on a Specific Post
PostSchema.statics.getTotalLikes = async function (postId) {
  try {
    const post = await this.findById(postId);
    if (!post) throw new Error('Post not found');

    return { success: true, totalLikes: post.likes.length };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
