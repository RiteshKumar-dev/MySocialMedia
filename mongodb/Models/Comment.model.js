import mongoose from 'mongoose';
const CommentSchema = new mongoose.Schema(
  {
    user: {
      userId: { type: String, required: true },
      avatar: { type: String, required: true },
      firstname: { type: String, required: true },
      lastname: { type: String },
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
