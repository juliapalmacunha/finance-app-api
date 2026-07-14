import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/index.js'

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
})
