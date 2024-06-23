import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import 'express-async-errors';
import connectDB from './src/DB/connect.js'
import appRoutes from './src/routes/index.js'
import notFoundMiddleWare from './src/middleware/not-found.js'
import errorHandlerMiddleware from './src/middleware/error-handler.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use(appRoutes)
app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware)
// Spin the server
const start = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the environment variables')
        }
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.error('Failed to start the server:', error)
    }
}

start()