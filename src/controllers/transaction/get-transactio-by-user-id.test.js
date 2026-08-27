import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/index.js'
import { transaction } from '../../tests/index.js'

describe('Get Transaction By User Id Controller', () => {
    const from = '2023-01-01'
    const to = '2023-12-31'
    class GetTransactionByIdUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const getTransactionByIdUseCase = new GetTransactionByIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionByIdUseCase,
        )

        return {
            sut,
            getTransactionByIdUseCase,
        }
    }

    it('should return 200 when getting a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        })
        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if is missing userId param', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            query: {
                userId: undefined,
                from,
                to,
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if userId param is invalid', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            query: {
                userId: 'invalid-id',
                from,
                to,
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found with UserNotFoundError', async () => {
        //arrange
        const { sut, getTransactionByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getTransactionByIdUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        //act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        })
        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionsByUserIdUseCase throws an error', async () => {
        //arrange
        const { sut, getTransactionByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getTransactionByIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        //act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        })
        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        //arrange
        const { sut, getTransactionByIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getTransactionByIdUseCase,
            'execute',
        )

        const userId = faker.string.uuid()

        //act
        await sut.execute({
            query: {
                userId,
                from,
                to,
            },
        })

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to)
    })
})
