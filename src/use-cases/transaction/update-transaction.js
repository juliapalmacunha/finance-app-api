import { UserNotFoundError } from '../../errors/user'

export class UpdateTransactionUseCase {
    constructor(getUserByIdRepository, updateTransactionRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.updateTransactionRepository = updateTransactionRepository
    }

    async excecute(params) {
        //verificar se o usuario existe
        const user = await this.getUserByIdRepository.execute(params.user_id)

        if (!user) {
            throw UserNotFoundError(params.user_id)
        }

        const transaction =
            await this.updateTransactionRepository.execute(params)

        return transaction
    }
}
