const errorHandlerMiddleware = (error, req, res, next) => {
  // default 500 error or provided in controller
  const customError = {
    statusCode: error.statusCode || 500,
    msg: error.message || 'Internal server error',
  }

  res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware
