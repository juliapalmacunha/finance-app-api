import { PostgresCreateUserRepository } from './create-user'
import { user } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        //arrange
        const sut = new PostgresCreateUserRepository()
        //act
        const result = await sut.execute(user)

        //assert

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })

    it('should call Prisma with correct values', async () => {
        //arrange
        const sut = new PostgresCreateUserRepository()
        const createSpy = jest.spyOn(prisma.user, 'create')

        //act
        await sut.execute(user)

        //assert
        expect(createSpy).toHaveBeenCalledWith({
            data: user,
        })
    })
})
