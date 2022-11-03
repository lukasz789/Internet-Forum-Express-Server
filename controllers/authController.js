import User from '../models/User.js'

import { CustomError } from '../customError/customError.js'

const register = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    throw new CustomError('Please provide all values', 400)
  }
  const usernameTaken = await User.findOne({ username: req.body.username })
  if (usernameTaken)
    throw new CustomError('Username taken, please choose other name.', 400)
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  })

  const token = user.setupJWT()

  res.status(201).json({ username: user.username, token })
}

const login = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    throw new CustomError('Please fill in both username and password.', 400)
  }

  const user = await User.findOne({ username: req.body.username })
  if (!user) throw new CustomError('Username or password is incorrect.')

  const isPasswordValid = await user.validatePassword(req.body.password)
  if (!isPasswordValid)
    throw new CustomError('Username or password is incorrect.')

  const token = user.setupJWT()
  res.status(201).json({ username: user.username, token })
}

export { login, register }
