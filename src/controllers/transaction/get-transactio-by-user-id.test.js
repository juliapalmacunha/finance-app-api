import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { UserNotFoundError } from '../../errors/user'

describe('Get Transaction By User Id Controller', () => {
    class GetTransactionByIdUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
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
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found with UserNotFoundError', async () => {
        //arrange
        const { sut, getTransactionByIdUseCase } = makeSut()
        jest.spyOn(getTransactionByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        //act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        })
        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionsByUserIdUseCase throws an error', async () => {
        //arrange
        const { sut, getTransactionByIdUseCase } = makeSut()
        jest.spyOn(getTransactionByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        })
        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        //arrange
        const { sut, getTransactionByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionByIdUseCase, 'execute')

        const userId = faker.string.uuid()

        //act
        await sut.execute({
            query: {
                userId,
            },
        })

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
