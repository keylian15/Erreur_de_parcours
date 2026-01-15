import express from 'express'
import cors from 'cors'
import taskRoutes from './src/routes/task.routes.js'
import userRoutes from './src/routes/user.routes.js'
import { swaggerDocument, swaggerUi, swaggerUiOptions } from './src/config/swagger.js';

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/users', userRoutes);  
app.use('/api/tasks', taskRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

export default app
