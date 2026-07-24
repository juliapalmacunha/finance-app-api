import express from 'express'
import { transactionsRouter, usersRouter } from './routes/index.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'

export const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.use('/api/transactions', transactionsRouter)

// Monta o caminho seguro: vai até a pasta do projeto -> docs -> swagger.json
const swaggerPath = path.resolve('docs', 'swagger.json')

// Agora o fs lê o arquivo usando o caminho correto e seguro
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
