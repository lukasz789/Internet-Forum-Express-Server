import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: 6,
      required: [true, 'provide content please'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'provide author please'],
    },
    createdIn: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
      required: [true, 'provide post please'],
    },
    authorName: {
      type: String,
      required: [true, 'provide author name please'],
    },
    upvoters: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Comment', CommentSchema)
