import 'dotenv/config.js'
import express from 'express'
import { postgresHelper } from './src/db/postgres/helper.js'

const app = express()

app.get('/', async (req, res) => {
    const results = await postgresHelper.query('SELECT * FROM users')
    res.send(JSON.stringify(results))
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
