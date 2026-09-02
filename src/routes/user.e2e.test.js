import request from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/user.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe('UserE2eTests', () => {
    const currentYear = new Date().getFullYear()
    const from = `${currentYear}-01-01`
    const to = `${currentYear}-12-31`

    it('POST api/users should return 201 when a user is created', async () => {
        //arrange
        const response = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })
        //assert
        expect(response.status).toBe(201)
    })

    it('GET api/users/:userId should return 200 when a user is found', async () => {
        //arrange
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //act
        const response = await request(app)
            .get(`/api/users/`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        //assert
        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
    })

    it('PATCH api/users should return 200 when a user is updated', async () => {
        //arrange
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        //act
        const response = await request(app)
            .patch(`/api/users/`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send(updateUserParams)

        //assert
        expect(response.status).toBe(200)
        expect(response.body.first_name).toBe(updateUserParams.first_name)
        expect(response.body.last_name).toBe(updateUserParams.last_name)
        expect(response.body.email).toBe(updateUserParams.email)
        expect(response.body.password).not.toBe(createdUser.password)
    })

    it('DELETE api/users/:userId should return 200 when a user is deleted', async () => {
        //arrange
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //act
        const response = await request(app)
            .delete(`/api/users/`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        //assert
        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdUser.id)
    })

    it('GET api/users/balance should return 200 and correct balance', async () => {
        //arrange
        //criando usuario
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //criando transacao do usuario
        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(from),
                type: TransactionType.EARNING,
                amount: 10000,
            })

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(from),
                type: TransactionType.EXPENSE,
                amount: 2000,
            })

        await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                user_id: createdUser.id,
                name: faker.commerce.productName(),
                date: new Date(from),
                type: TransactionType.INVESTMENT,
                amount: 2000,
            })

        //act
        const response = await request(app)
            .get(`/api/users/balance?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        //assert
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            earnings: '10000',
            expenses: '2000',
            investments: '2000',
            balance: '6000',
            earningsPercent: '71',
            expensesPercent: '14',
            investmentsPercent: '14',
        })
    })

    it('POST api/users should return 400 when the provided email is already in use', async () => {
        //arrange
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //act
        const response2 = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
                email: createdUser.email,
            })

        //assert
        expect(response2.status).toBe(400)
    })

    it('POST api/login should return 200 when credentials are valid ', async () => {
        //arrange
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //act
        const response = await request(app).post('/api/users/login').send({
            password: user.password,
            email: createdUser.email,
        })

        //assert
        expect(response.status).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('POST api/users/login should return 404 when user is not found', async () => {
        const response = await request(app).post('/api/users/login').send({
            email: 'invalid@example.com',
            password: faker.internet.password(),
        })

        // Assert
        expect(response.status).toBe(404)
    })

    it('POST api/users/login should return 401 when password is invalid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        const response = await request(app).post('/api/users/login').send({
            email: createdUser.email,
            password: 'invalidPassword',
        })

        // Assert
        expect(response.status).toBe(401)
    })

    it('POST api/refresh-token should return 200  and new token when refresh token is valid ', async () => {
        //arrange
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //act
        const response = await request(app)
            .post('/api/users/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            })

        //assert
        expect(response.status).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })
})
