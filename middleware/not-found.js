const notFoundMiddleware = (req, res) => {
  res.status(404).send('route doesnt exist')
}

export default notFoundMiddleware
