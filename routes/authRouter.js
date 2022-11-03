import express from 'express'

import { login, register } from '../controllers/authController.js'

const router = express.Router()

router.route('/login').post(login)
router.route('/register').post(register)

export default router
