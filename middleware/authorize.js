import { CustomError } from '../customError/customError.js'

import JWT from 'jsonwebtoken'

const authorize = async (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization || authorization.slice(0, 6) !== 'Bearer')
    throw new CustomError('Unauthorized access', 401)
  const token = authorization.slice(7)

  // check if token was created by the server
  try {
    const jwtPayload = JWT.verify(token, process.env.JWT_SECRET)
    req.userId = jwtPayload.userId
    next()
  } catch (error) {
    throw new CustomError('Unauthorized access', 401)
  }
}

export default authorize
