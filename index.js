import 'dotenv/config.js'
import express from 'express'
import {
    UpdateUserController,
    GetUserByIdController,
    CreateUserController,
    DeleteUserController,
} from './src/controllers/index.js'
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js'
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js'
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js'
import { CreateUserUseCase } from './src/use-cases/create-user.js'

const app = express()

app.use(express.json())

//puxando informacoes do banco
app.get('/api/users/:id', async (request, response) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

    const { statusCode, body } = await getUserByIdController.execute(request)
    response.status(statusCode).send(body)
})

//enviando para o banco
app.post('/api/users', async (request, response) => {
    const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()
    const postgresCreateUserRepository = new PostgresCreateUserRepository()
    const createUserUseCase = new CreateUserUseCase(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
    )
    const createUserController = new CreateUserController(createUserUseCase)

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
