import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { ForbiddenError } from '../../errors/user.js'

describe('DeleteTransactionUseCase', () => {
    const user_id = faker.string.uuid()
    class DeleteTransactionRepositoryStub {
        async execute() {
            return {
                ...transaction,
                user_id,
            }
        }
    }

    class GetTransactionByIdRepository {
        async execute() {
            return {
                ...transaction,
                user_id,
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const getTransactionByIdRepository = new GetTransactionByIdRepository()
        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()
        const id = faker.string.uuid()

        //act
        const result = await sut.execute(id, user_id)

        //assert
        expect(result).toEqual({
            ...transaction,
            user_id,
        })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )
        const id = faker.string.uuid()

        //act
        await sut.execute(id, user_id)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(id)
    })

    it('should throw when DeleteTransactionRepository throws', async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const id = faker.string.uuid()

        //act
        const promise = sut.execute(id, user_id)

        //assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError when transaction not found', async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        const id = faker.string.uuid()

        //act
        const promise = sut.execute(id, user_id)

        //assert
        await expect(promise).rejects.toThrow(TransactionNotFoundError)
    })

    it('should throw ForbiddenError when user is not the owner of the transaction', async () => {
        //arrange
        const { sut, deleteTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteTransactionRepository, 'execute')
            .mockRejectedValueOnce(new ForbiddenError())

        const id = faker.string.uuid()

        //act
        const promise = sut.execute(id, user_id)

        //assert
        await expect(promise).rejects.toThrow(ForbiddenError)
    })
})
