import request from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/user.js'

describe('UserE2eTests', () => {
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

    it('GET api/users should return 200 when a user is found', async () => {
        //arrange
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                id: undefined,
                ...user,
            })

        //act
        const response = await request(app).get(`/api/users/${createdUser.id}`)

        //assert
        expect(response.status).toBe(200)
        expect(response.body).toEqual(createdUser)
    })
})
