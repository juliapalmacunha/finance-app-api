import { PostgresGetUserByIdRepository } from './get-user-by-id.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests'

describe('GetUserByIdRepository', () => {
    it('should get user by id on db', async () => {
        //arrange
        const sut = new PostgresGetUserByIdRepository()
        const user = await prisma.user.create({ data: fakeUser })

        //act
        const result = await sut.execute(user.id)

        //assert
        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct values', async () => {
        //arrange
        const sut = new PostgresGetUserByIdRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        //act
        await sut.execute(fakeUser.id)

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakeUser.id,
            },
        })
    })
})
