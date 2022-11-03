import express from 'express'

// express-async-errors package
//    to not add try{(...)}catch(err){next(err)} to every async function in routers
//    it will automaticly set it up under the hood
import 'express-async-errors'

// DB
import connectDB from './DB/connect.js'

// middlewares
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

// routers
import authRouter from './routes/authRouter.js'
import postsRouter from './routes/postsRouter.js'
import commentsRouter from './routes/commentsRouter.js'

// enable access to .env variables
import dotenv from 'dotenv'
dotenv.config()

// security
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
// request limitter
import rateLimit from 'express-rate-limit'

const app = express()

// CORS ; let frontend communicate with backend server
import cors from 'cors'
app.use(cors())
// could specify here exact urls allowed, for example:
// app.use(
//   cors({
//     origin:
//       'http://localhost:3000',
//   })
// )

// to parse json data in controllers (when using POST request -> user sending data to the server)
app.use(express.json())

// security
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
// request limitter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again later.',
})
app.use(limiter)

app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)
app.use('/api/posts/:postId/comments', commentsRouter)

app.use(notFoundMiddleware)
// custom error handler has to be last to work correctly
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB(process.env.DATABASE_URL)
    app.listen(port, () => {
      console.log(`server listening ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()
