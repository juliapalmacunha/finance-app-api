import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/index.js'
import { TransactionType } from '@prisma/client'

describe('UserE2eTests', () => {
    it('POST api/transactions should return 201 when a transaction is created', async () => {
        //criar usuario
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //criar transação
        const response = await request(app)
            .post(`/api/transactions`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        //assert
        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.type).toBe(transaction.type)
        expect(response.body.amount).toBe(String(transaction.amount))
    })

    it('GET api/transactions should return 200 when get transactions by userId', async () => {
        //cria usuario
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        //criar transação
        const { body: createdTransaction } = await request(app)
            .post(`/api/transactions`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        const from = '2023-01-01'
        const to = '2023-12-31'

        //chamar requisição
        const response = await request(app)
            .get(`/api/transactions?from=${from}&to=${to}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        //assert
        //id da primeira transação [0] seja da transação que eu criei
        expect(response.status).toBe(200)
        expect(response.body[0].id).toBe(createdTransaction.id)
    })

    it('PATCH api/transactions/transactionId should return 200 when get transaction is updated', async () => {
        //cria usuario
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        //criar transação
        const { body: createdTransaction } = await request(app)
            .post(`/api/transactions/`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        //chamar requisição para atualizar
        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                type: TransactionType.EXPENSE,
                amount: 200,
            })

        //assert
        //id da primeira transação [0] seja da transação que eu criei
        expect(response.status).toBe(200)
        expect(response.body.amount).toBe('200')
        expect(response.body.type).toBe(TransactionType.EXPENSE)
    })

    it('DELETE api/transactions should return 200 when a transaction is deleted', async () => {
        //criar usuario
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //criar transação
        const { body: createdTransaction } = await request(app)
            .post(`/api/transactions`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        const response = await request(app)
            .delete(`/api/transactions/${createdTransaction.id}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        //assert
        expect(response.status).toBe(200)
        expect(response.body.id).toBe(createdTransaction.id)
    })

    it('PATCH api/transactions/:id should return 404 when transaction does not exist', async () => {
        //criar usuario
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //chamar requisição para atualizar
        const response = await request(app)
            .patch(`/api/transactions/${transaction.id}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)
            .send({
                type: TransactionType.EXPENSE,
                amount: 200,
            })

        //assert
        expect(response.status).toBe(404)
    })

    it('DELETE api/transactions/:id should return 404 when transaction does not exist', async () => {
        //criar usuario
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })
        //chamar requisição para atualizar
        const response = await request(app)
            .delete(`/api/transactions/${transaction.id}`)
            .set('Authorization', `Bearer ${createdUser.tokens.accessToken}`)

        //assert
        expect(response.status).toBe(404)
    })
})
