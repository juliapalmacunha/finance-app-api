import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction.js'
import { transaction } from '../../tests/index.js'

describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return {
            sut,
            updateTransactionRepository,
        }
    }

    it('should update transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()

        const transactionId = faker.string.uuid()

        //act
        const result = await sut.execute(transactionId, transaction)

        //assert
        expect(result).toEqual(transaction)
    })

    it('should call updateTransactionRepository with correct params', async () => {
        //arrange
        const { sut } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            sut.updateTransactionRepository,
            'execute',
        )

        const transactionId = faker.string.uuid()

        //act
        await sut.execute(transactionId, transaction)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId, transaction)
    })

    it('should throw if updateTransactionRepository throws', async () => {
        //arrange
        const { sut } = makeSut()
        import.meta.jest
            .spyOn(sut.updateTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const transactionId = faker.string.uuid()

        //act
        const promise = sut.execute(transactionId, transaction)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
