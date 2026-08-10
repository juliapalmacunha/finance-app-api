import { PostgresDeleteUserRepository } from './delete-user.js'
import { user } from '../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import { UserNotFoundError } from '../../../errors/index.js'
import { Prisma } from '@prisma/client'

describe('PostgresDeleteUserRepository', () => {
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
        const deleteSpy = import.meta.jest.spyOn(prisma.user, 'delete')

        //act
        await sut.execute(user.id)

        //assert
        expect(deleteSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresDeleteUserRepository()
        import.meta.jest
            .spyOn(prisma.user, 'delete')
            .mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(user.id)

        //assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        //arrange
        const sut = new PostgresDeleteUserRepository()
        import.meta.jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new Prisma.PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        //act
        const promise = sut.execute(user.id)

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })
})
