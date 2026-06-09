import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return {
            sut,
            deleteTransactionUseCase,
        }
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })
        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if transactionId is not valid', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            params: {
                transactionId: 'invalid-id',
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if transaction is not found', async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        )

        //act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })
        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteTransactionUseCase throws an error', async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        const transactionId = faker.string.uuid()

        //act
        await sut.execute({
            params: {
                transactionId,
            },
        })
        //assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
