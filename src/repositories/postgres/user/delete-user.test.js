import { PostgresDeleteUserRepository } from './delete-user'
import { user } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import { UserNotFoundError } from '../../../errors'
import { PrismaClientKnownRequestError } from '@prisma/client'

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

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(user.id)

        //assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        //arrange
        const sut = new PostgresDeleteUserRepository()
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        //act
        const promise = sut.execute(user.id)

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })
})
