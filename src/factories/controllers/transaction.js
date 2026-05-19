import { CreateTransactionController } from '../../controllers'
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres'
import { CreateTransactionUseCase } from '../../use-cases'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )
    return createTransactionController
}
