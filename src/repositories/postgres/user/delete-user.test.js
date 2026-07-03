import { PostgresDeleteUserRepository } from './delete-user'
import { user } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'

describe('DeleteUserRepository', () => {
    it('should delete a user on db', async () => {
        await prisma.user.create({ data: user })
        //arrange
        const sut = new PostgresDeleteUserRepository()
        //act
        const result = await sut.execute(user.id)

        //assert

        expect(result).toStrictEqual(user)
    })
})
