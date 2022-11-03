import Comment from '../models/Comment.js'
import User from '../models/User.js'
import Post from '../models/Post.js'
import { CustomError } from '../customError/customError.js'

import mongoose from 'mongoose'

const addComment = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId, isOpened: true })
  if (!post) throw new CustomError('No post with such id or post closed', 404)

  if (!req.body.content) throw new CustomError('Please provide all values', 400)

  req.body.createdBy = req.userId

  const user = await User.findOne({ _id: req.userId })

  const comment = await Comment.create({
    content: req.body.content,
    createdIn: req.params.postId,
    createdBy: req.body.createdBy,
    authorName: user.username,
  })

  res.status(201).json({ comment })
}

const upVoteComment = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId, isOpened: true })
  if (!post) throw new CustomError('No post with such id or post closed', 404)

  const comment = await Comment.findOne({ _id: req.params.commentId })
  if (!comment) throw new CustomError('No comment with such id', 404)

  const wasCommentUpvoted = await Comment.find({
    upvoters: req.userId,
  })

  if (comment.upvoters.includes(req.userId.toString())) {
    throw new CustomError('Comment already upvoted', 400)
  }
  if (comment.createdBy.toString() === req.userId.toString()) {
    throw new CustomError('You cant upvote Your own comment', 400)
  }

  const upvotedComment = await Comment.findOneAndUpdate(
    { _id: req.params.commentId },
    { $push: { upvoters: req.userId } },
    { returnDocument: 'after', runValidators: true }
  )
  res.status(200).json({ upvotedComment })
}

const getAllComments = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId })
  if (!post) throw new CustomError('No post with such id', 404)

  let allCommentsForGivenPostQuery = Comment.find({
    createdIn: req.params.postId,
  })

  if (req.query.sort) {
    if (req.query.sort === 'latest') {
      allCommentsForGivenPostQuery =
        allCommentsForGivenPostQuery.sort('-createdAt')
    }
    if (req.query.sort === 'oldest') {
      allCommentsForGivenPostQuery =
        allCommentsForGivenPostQuery.sort('createdAt')
    }
    if (req.query.sort === 'best') {
      allCommentsForGivenPostQuery = Comment.aggregate([
        { $match: { createdIn: mongoose.Types.ObjectId(req.params.postId) } },
        { $addFields: { upvoters_count: { $size: '$upvoters' } } },
        { $sort: { upvoters_count: -1 } },
      ])
    }
  }

  const allCommentsForGivenPost = await allCommentsForGivenPostQuery
  res.status(200).json({ allCommentsForGivenPost })
}

const deleteComment = async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentId })

  if (!comment) throw new CustomError('No comment with such id', 404)

  if (req.userId !== comment.createdBy.toString())
    throw new CustomError('Unauthorized access', 401)

  await comment.remove()

  res.status(200).json({ message: 'Comment deleted' })
}

export { addComment, getAllComments, upVoteComment, deleteComment }
