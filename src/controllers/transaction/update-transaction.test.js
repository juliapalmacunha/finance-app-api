import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'
import { transaction } from '../../tests/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return {
            sut,
            updateTransactionUseCase,
        }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 200 when updating a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if transactionId is not valid', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            params: {
                transactionId: 'invalid-id',
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when unallowed fields is provided', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                unallowedField: 'some_value',
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if invalid amount is provided', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                amount: 'invalid-amount',
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if invalid type is provided', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                type: 'invalid-type',
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateTransactionUseCase throws an error', async () => {
        //arrange
        const { sut, updateTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        //arrange
        const { sut, updateTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            updateTransactionUseCase,
            'execute',
        )
        //act
        await sut.execute(httpRequest)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        )
    })

    it('should return 404 if transaction not found', async () => {
        // arrange
        const { sut, updateTransactionUseCase } = makeSut()

        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })
})
