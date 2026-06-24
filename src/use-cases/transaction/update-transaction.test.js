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
})
