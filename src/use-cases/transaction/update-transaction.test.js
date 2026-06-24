import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'

describe('UpdateTransactionUseCase', () => {
    const transactionParams = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                id: transactionId,
                ...transactionParams,
            }
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
        const result = await sut.execute(transactionId, transactionParams)

        //assert
        expect(result).toEqual({
            ...transactionParams,
            id: transactionId,
        })
    })

    it('should call updateTransactionRepository with correct params', async () => {
        //arrange
        const { sut } = makeSut()
        const executeSpy = jest.spyOn(
            sut.updateTransactionRepository,
            'execute',
        )

        const transactionId = faker.string.uuid()

        //act
        await sut.execute(transactionId, transactionParams)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            transactionId,
            transactionParams,
        )
    })

    it('should throw if updateTransactionRepository throws', async () => {
        //arrange
        const { sut } = makeSut()
        jest.spyOn(
            sut.updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const transactionId = faker.string.uuid()

        //act
        const promise = sut.execute(transactionId, transactionParams)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
