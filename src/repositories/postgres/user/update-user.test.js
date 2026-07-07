import { PostgresUpdateUserRepository } from './update-user.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests'
import { faker } from '@faker-js/faker'

describe('UpdateUserRepository', () => {
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
})
