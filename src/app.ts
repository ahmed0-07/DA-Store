import express from 'express'
import morgan from 'morgan'
import authRouter from './modules/Auth/Auth.Routes.js'
import userRouter from './modules/User/User.Routes.js'
import env from './shared/config/dotenv.js'

const app = express()

if (env.NODE_ENV == "development") {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

export default app