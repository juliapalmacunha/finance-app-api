import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/index.js'
import { user } from '../../tests/index.js'

describe('GetTransactionByUserIdUseCase', () => {
    class GetTransactionByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionByUserIdRepository =
            new GetTransactionByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        }
    }

    it('should get transaction by user id successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(faker.string.uuid())

        //assert
        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user is not found', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)
        const id = faker.string.uuid()

        //act
        const promise = sut.execute(id)

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(id))
    })

    it('should call GetUserByIdRepository with correct param', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )
        const id = faker.string.uuid()

        //act
        await sut.execute(id)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(id)
    })

    it('should call getTransactionsByUserIdRepository with correct param', async () => {
        //arrange
        const { sut, getTransactionByUserIdRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        )
        const id = faker.string.uuid()

        //act
        await sut.execute(id)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(id)
    })

    it('should throw getUserByIdRepository throws', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        //act
        const promise = sut.execute(id)

        //assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw getTransactionByUserIdRepository throws', async () => {
        //arrange
        const { sut, getTransactionByUserIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getTransactionByUserIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const id = faker.string.uuid()

        //act
        const promise = sut.execute(id)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
