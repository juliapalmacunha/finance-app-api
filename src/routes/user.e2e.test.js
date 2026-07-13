import request from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/user.js'
import { faker } from '@faker-js/faker'

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
            .patch(`/api/users/${createdUser.id}`)
            .send(updateUserParams)

        //assert
        expect(response.status).toBe(200)
        expect(response.body.first_name).toBe(updateUserParams.first_name)
        expect(response.body.last_name).toBe(updateUserParams.last_name)
        expect(response.body.email).toBe(updateUserParams.email)
        expect(response.body.password).not.toBe(createdUser.password)
    })
})
