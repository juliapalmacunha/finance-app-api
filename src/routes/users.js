import { Router } from 'express'

import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeLoginUserController,
    makeRefreshTokenController,
    makeUpdateUserController,
} from '../factories/controllers/user.js'
import { auth } from '../middlewares/auth.js'

export const usersRouter = Router()

usersRouter.get('/me', auth, async (request, response) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute({
        ...request,
        params: { id: request.userId },
    })
    response.status(statusCode).send(body)
})

usersRouter.get('/me/balance/', auth, async (request, response) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute({
        ...request,
        params: { userId: request.userId },
        query: {
            from: request.query.from,
            to: request.query.to,
        },
    })
    response.status(statusCode).send(body)
})

//enviando para o banco
usersRouter.post('/', async (request, response) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)
    response.status(statusCode).send(body)
})

//atualizando parcialmente o banco
usersRouter.patch('/me', auth, async (request, response) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute({
        ...request,
        params: {
            userId: request.userId,
        },
    })
    response.status(statusCode).send(body)
})

//deletando do banco
usersRouter.delete('/me', auth, async (request, response) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute({
        ...request,
        params: { userId: request.userId },
    })
    response.status(statusCode).send(body)
})

//enviando login
usersRouter.post('/auth/login', async (request, response) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(request)
    response.status(statusCode).send(body)
})

usersRouter.post('/auth/refresh-token', async (request, response) => {
    const refreshTokenController = makeRefreshTokenController()

    const { statusCode, body } = await refreshTokenController.execute(request)
    response.status(statusCode).send(body)
})
