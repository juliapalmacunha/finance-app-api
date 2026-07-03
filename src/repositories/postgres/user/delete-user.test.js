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

    it('should call Prisma with correct values', async () => {
        await prisma.user.create({ data: user })
        //arrange
        const sut = new PostgresDeleteUserRepository()
        const deleteSpy = jest.spyOn(prisma.user, 'delete')

        //act
        await sut.execute(user.id)

        //assert
        expect(deleteSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })
})
