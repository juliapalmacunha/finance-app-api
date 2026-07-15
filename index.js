import 'dotenv/config.js'
import { app } from './src/app.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'

app.listen(process.env.PORT, () =>
    console.log('Server is running on port ' + process.env.PORT),
)

// Monta o caminho seguro: vai até a pasta do projeto -> docs -> swagger.json
const swaggerPath = path.resolve('docs', 'swagger.json')

// Agora o fs lê o arquivo usando o caminho correto e seguro
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
