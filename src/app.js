import express from 'express'
import { transactionsRouter, usersRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

// A SOLUÇÃO: process.cwd() aponta para a raiz do projeto com segurança
const swaggerPath = path.join(process.cwd(), 'docs', 'swagger.json')
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
