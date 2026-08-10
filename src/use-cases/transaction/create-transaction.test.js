import { CreateTransactionUseCase } from './create-transaction.js'
import { UserNotFoundError } from '../../errors/index.js'
import { transaction, user } from '../../tests/index.js'

describe('CreateTransactionUseCase', () => {
    const createTransaction = {
        ...transaction,
        id: undefined,
    }

    class CreateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class idGeneratorAdapterStub {
        async execute() {
            return 'transaction-id'
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapter = new idGeneratorAdapterStub()
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }

    it('should create transaction successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(createTransaction)

        //assert
        expect(result).toEqual(transaction)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        //act
        await sut.execute(createTransaction)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(createTransaction.user_id)
    })

    it('should call idGeneratorAdapter', async () => {
        //arrange
        const { sut, idGeneratorAdapter } = makeSut()
        const executeSpy = import.meta.jest.spyOn(idGeneratorAdapter, 'execute')

        //act
        await sut.execute(createTransaction)

        //assert
        expect(executeSpy).toHaveBeenCalled()
    })

    it('should CreateTransactionRepository with correct params', async () => {
        //arrange
        const { sut, createTransactionRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            createTransactionRepository,
            'execute',
        )
        const transactionId = 'transaction-id'

        //act
        await sut.execute(createTransaction)

        //assert
        expect(executeSpy).toHaveBeenCalledWith({
            ...createTransaction,
            id: transactionId,
        })
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValueOnce(null)

        //act
        const promise = sut.execute({
            ...createTransaction,
            user_id: createTransaction.user_id,
        })

        //assert
        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransaction.user_id),
        )
    })

    it('should throw if CreateTransactionRepository throws', async () => {
        //arrange
        const { sut, createTransactionRepository } = makeSut()
        import.meta.jest
            .spyOn(createTransactionRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        //act
        const result = sut.execute(createTransaction)

        //assert
        await expect(result).rejects.toThrow()
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        //act
        const result = sut.execute(createTransaction)

        //assert
        await expect(result).rejects.toThrow()
    })

    it('should throw if idGeneratorAdapter throws', async () => {
        //arrange
        const { sut, idGeneratorAdapter } = makeSut()
        import.meta.jest
            .spyOn(idGeneratorAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        //act
        const result = sut.execute(createTransaction)

        //assert
        await expect(result).rejects.toThrow()
    })
})
