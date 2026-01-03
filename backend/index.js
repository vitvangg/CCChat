import express from 'express' 
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import cookieParser from 'cookie-parser'
import auth from './middleware/auth.js'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import cors from 'cors'

dotenv.config()

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true // Allow cookies to be sent
}))

app.use('/api/auth', authRouter)

app.use(auth) 
app.use('/api/user', userRouter)

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}.`)
  })
})