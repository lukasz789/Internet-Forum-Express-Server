import express from 'express'

import {
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
} from '../controllers/postsController.js'

import authorize from '../middleware/authorize.js'

const router = express.Router()

router.route('/').get(getAllPosts).post(authorize, createPost)
router
  .route('/:postId')
  .delete(authorize, deletePost)
  .patch(authorize, updatePost)

export default router
