import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction.js'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { sut, createTransactionUseCase }
    }

    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 if transaction is created successfully', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 400 when missing user_id', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                user_id: undefined,
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                name: undefined,
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                date: undefined,
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                type: undefined,
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                amount: undefined,
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if date is not valid', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                date: 'invalid-date',
            },
        })
        //assert
        expect(result.statusCode).toBe(400)
    })
})
