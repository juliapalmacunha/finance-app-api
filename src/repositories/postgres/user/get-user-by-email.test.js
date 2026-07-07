import { prisma } from '../../../../prisma/prisma.js'
import { user as fakerUser } from '../../../tests'
import { PostgresGetUserByEmailRepository } from './get-user-by-email.js'

describe('GetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        // arrange
        const sut = new PostgresGetUserByEmailRepository()
        const user = await prisma.user.create({ data: fakerUser })

        // act
        const result = await sut.execute(user.email)

        // assert
        expect(result).toStrictEqual(user)
    })
})
