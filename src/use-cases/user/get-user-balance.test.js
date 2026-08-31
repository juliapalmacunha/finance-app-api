import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import { user, userBalance } from '../../tests/index.js'

describe('GetUserBalanceUseCase', () => {
    const currentYear = new Date().getFullYear()
    const from = `${currentYear}-01-01`
    const to = `${currentYear}-12-31`
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )
        return {
            getUserBalanceRepository,
            getUserByIdRepository,
            sut,
        }
    }

    it('should get user balance successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(faker.string.uuid(), from, to)

        //assert
        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)
        const userId = faker.string.uuid()

        //act
        const promise = sut.execute(userId, from, to)

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        //act
        await sut.execute(userId, from, to)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        //arrange
        const { sut, getUserBalanceRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserBalanceRepository,
            'execute',
        )

        const userId = faker.string.uuid()

        //act
        await sut.execute(userId, from, to)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        //act
        const result = sut.execute(faker.string.uuid(), from, to)

        //assert
        await expect(result).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        //arrange
        const { sut, getUserBalanceRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserBalanceRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        //act
        const result = sut.execute(faker.string.uuid(), from, to)

        //assert
        await expect(result).rejects.toThrow()
    })
})
