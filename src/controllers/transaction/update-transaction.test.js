import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUseCaseStub {
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
})
