import User from '../models/User.js'
import Post from '../models/Post.js'
import { CustomError } from '../customError/customError.js'

const createPost = async (req, res) => {
  if (!req.body.title || !req.body.content)
    throw new CustomError('Please provide all values', 400)

  req.body.createdBy = req.userId

  const user = await User.findOne({ _id: req.userId })
  const authorName = user.username

  const post = await Post.create({
    authorName: authorName,
    title: req.body.title,
    content: req.body.content,
    createdBy: req.body.createdBy,
  })
  res.status(201).json({ post })
}

const deletePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId })

  if (!post) throw new CustomError('No post with such id', 404)

  if (req.userId !== comment.createdBy.toString())
    throw new CustomError('Unauthorized access', 401)

  await post.remove()

  res.status(200).json({ message: 'Post deleted' })
}

const getAllPosts = async (req, res) => {
  // query for single post, by ID
  if (req.query.postId) {
    const post = await Post.findOne({ _id: req.query.postId })
    if (!post) throw new CustomError('No post with such id or post closed', 404)
    else {
      res.status(200).json({ post })
    }
  }

  // filter by isOpened, username, content OR title
  let queryObject = {}
  if (req.query.isOpened) {
    queryObject.isOpened = req.query.isOpened
  }
  if (req.query.search) {
    queryObject = {
      ...queryObject,
      $or: [
        { content: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
      ],
    }
  }
  if (req.query.username) {
    queryObject.authorName = { $regex: req.query.username, $options: 'i' }
  }

  let allPostsQuery = Post.find(queryObject)

  // sorting...
  if (req.query.sort) {
    if (req.query.sort === 'latest') {
      allPostsQuery = allPostsQuery.sort('-createdAt')
    }
    if (req.query.sort === 'oldest') {
      allPostsQuery = allPostsQuery.sort('createdAt')
    }
  }

  // pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const skip = (page - 1) * limit

  allPostsQuery = allPostsQuery.skip(skip).limit(limit)

  const allPosts = await allPostsQuery

  const totalPosts = await Post.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalPosts / limit)

  res.status(200).json({ allPosts, numOfPages, totalPosts })
}

const updatePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId })

  if (!post) throw new CustomError('No post with such id', 404)

  // check if user is author of the post
  if (req.userId !== comment.createdBy.toString())
    throw new CustomError('Unauthorized access', 401)

  if (req.body.title && req.body.content) {
    // a) ---normal post edit---
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      req.body,
      {
        //return post after updates, not old one
        returnDocument: 'after',
        runValidators: true,
      }
    )

    res.status(200).json({ updatedPost })
  } else if (req.body.isOpened === false) {
    // b) ---set post as closed---
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      { isOpened: false },
      { returnDocument: 'after', runValidators: true }
    )
    res.status(200).json({ updatedPost })
  } else {
    throw new CustomError('Please provide all values', 400)
  }
}

export { createPost, deletePost, getAllPosts, updatePost }
