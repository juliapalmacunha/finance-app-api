import 'dotenv/config.js'
import express from 'express'
import {
    UpdateUserController,
    GetUserByIdController,
    CreateUserController,
    DeleteUserController,
} from './src/controllers/index.js'

const app = express()

app.use(express.json())

//puxando informacoes do banco
app.get('/api/users/:id', async (request, response) => {
    const getUserByIdController = new GetUserByIdController()
    const { statusCode, body } = await getUserByIdController.execute(request)
    response.status(statusCode).send(body)
})

//enviando para o banco
app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController()
    const { statusCode, body } = await createUserController.execute(request)
    response.status(statusCode).send(body)
})

//atualizando parcialmente o banco
app.patch('/api/users/:userId', async (request, response) => {
    const updateUserController = new UpdateUserController()
    const { statusCode, body } = await updateUserController.execute(request)
    response.status(statusCode).send(body)
})

//deletando do banco
app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserController = new DeleteUserController()
    const { statusCode, body } = await deleteUserController.execute(request)
    response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
    console.log('Server is running on port ' + process.env.PORT),
)
