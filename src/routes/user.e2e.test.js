import request from 'supertest'
import { app } from '../../index.js'
import { user } from '../tests/fixtures/user.js'

describe('UserE2eTests', () => {
    it('post /users should return 201 when a user is created', async () => {
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
})
