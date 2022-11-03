import express from 'express'

import {
  addComment,
  getAllComments,
  upVoteComment,
  deleteComment,
} from '../controllers/commentsController.js'

import authorize from '../middleware/authorize.js'

const router = express.Router({ mergeParams: true })

router.route('/').get(getAllComments).post(authorize, addComment)
router
  .route('/:commentId')
  .patch(authorize, upVoteComment)
  .delete(authorize, deleteComment)

export default router
