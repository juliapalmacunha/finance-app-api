import 'dotenv/config.js'
import express from 'express'
import { transactionsRouter, usersRouter } from './src/routes/index.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.use('/api/transactions', transactionsRouter)

app.listen(process.env.PORT, () =>
    console.log('Server is running on port ' + process.env.PORT),
)
