import express from 'express'
import cors from 'cors'
import taskRoutes from './src/routes/task.routes.js'
import userRoutes from './src/routes/user.routes.js'

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/users', userRoutes);  
app.use('/api/tasks', taskRoutes)

export default app
