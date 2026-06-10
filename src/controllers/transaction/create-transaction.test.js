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

    it('should return 201 if transaction is created successfully (earning)', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                type: 'EARNING',
            },
        })

        //assert
        expect(result.statusCode).toBe(201)
    })

    it('should return 201 if transaction is created successfully (investment)', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                type: 'INVESTMENT',
            },
        })

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

    it('should return 400 if type is not EXPENSE, EARNING OR INVESTMENT', async () => {
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

    it('should return 400 if amount is not a valid number', async () => {
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

    it('should return 500 if CreateTransactionUseCase throws an error', async () => {
        //arrange
        const { sut, createTransactionUseCase } = makeSut()
        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error('Unexpected error'),
        )
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call CreateTransactionUseCase with correct params', async () => {
        //arrange
        const { sut, createTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

        //act
        await sut.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
