import { ForbiddenError, TransactionNotFoundError } from '../../errors/index.js'

export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository, getTransactionByIdRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }

    async execute(transactionId, userId) {
        //verificar se a transacao pertence ao usuario
        const foundedTransaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (!foundedTransaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (foundedTransaction.user_id !== userId) {
            throw new ForbiddenError()
        }

        const deletedTransaction =
            await this.deleteTransactionRepository.execute(transactionId)

        return deletedTransaction
    }
}
