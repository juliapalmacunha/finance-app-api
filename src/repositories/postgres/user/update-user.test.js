import { PostgresUpdateUserRepository } from './update-user.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { UserNotFoundError } from '../../../errors/user.js'

describe('PostgresUpdateUserRepository', () => {
    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    it('should update a user on db', async () => {
        //arrange
        const sut = new PostgresUpdateUserRepository()
        const user = await prisma.user.create({ data: fakeUser })

        const result = await sut.execute(user.id, updateUserParams)

        //assert
        expect(result).toStrictEqual(updateUserParams)
    })

    it('should call Prisma with correct values', async () => {
        //arrange
        const sut = new PostgresUpdateUserRepository()
        const user = await prisma.user.create({ data: fakeUser })

        const prismaSpy = jest.spyOn(prisma.user, 'update')

        await sut.execute(user.id, updateUserParams)

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUserParams,
        })
    })

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(fakeUser.id, updateUserParams)

        //assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        //arrange
        const sut = new PostgresUpdateUserRepository()
        jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new Prisma.PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        //act
        const promise = sut.execute(fakeUser.id, updateUserParams)

        //assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(fakeUser.id),
        )
    })
})
