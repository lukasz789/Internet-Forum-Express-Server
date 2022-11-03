import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'provide title please'],
      minlength: 6,
      trim: true,
    },
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
    authorName: {
      type: String,
      required: [true, 'provide author name please'],
    },
    isOpened: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Post', PostSchema)
