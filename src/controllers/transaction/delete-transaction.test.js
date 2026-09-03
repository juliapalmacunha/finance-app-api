import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'
import { TransactionNotFoundError } from '../../errors/index.js'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
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
                user_id: faker.string.uuid(),
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
                user_id: faker.string.uuid(),
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if transaction is not found', async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        //act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
                user_id: faker.string.uuid(),
            },
        })
        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteTransactionUseCase throws an error', async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        //act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
                user_id: faker.string.uuid(),
            },
        })

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        //arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionUseCase,
            'execute',
        )

        const transactionId = faker.string.uuid()
        const userId = faker.string.uuid()

        //act
        await sut.execute({
            params: {
                transactionId,
                user_id: userId,
            },
        })
        //assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId, userId)
    })
})
