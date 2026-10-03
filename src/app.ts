import express from 'express'
import morgan from 'morgan'
import authRouter from './modules/Auth/Auth.Routes.js'
import userRouter from './modules/User/User.Routes.js'
import categoryRouter from './modules/Categories/Categories.Routes.js'
import productRouter from './modules/Product/Product.Routes.js'
import env from './shared/config/dotenv.js'
import { globalErrorHandler, notFound } from './shared/middlewares/globalError.js'

const app = express()

if (env.NODE_ENV == "development") {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/products', productRouter)

app.all("/*splat", notFound)
app.use(globalErrorHandler)

export default app