import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'

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
})
