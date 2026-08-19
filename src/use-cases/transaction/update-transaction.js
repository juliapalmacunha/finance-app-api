import { ForbiddenError } from '../../errors/index.js'

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getTransactionByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }

    async execute(transactionId, params) {
        const foundTransaction =
            await this.getTransactionByIdRepository.execute(transactionId)
        //verifica se a transacao existe e se o id da transacao é igual ao id da transacao encontrada
        if (params.userId && transactionId !== foundTransaction?.id) {
            throw new ForbiddenError()
        }
        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )

        return transaction
    }
}
