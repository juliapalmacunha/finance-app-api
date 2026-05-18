import { UserNotFoundError } from '../../errors/user'
import { v4 as uuidv4 } from 'uuid'

export class CreateTransactionUseCase {
    constructor(postgresCreateTransactionRepository, GetUserByIdRepository) {
        this.postgresCreateTransactionRepository =
            postgresCreateTransactionRepository
        this.GetUserByIdRepository = GetUserByIdRepository
    }

    async execute(createTransactionParams) {
        //validar se o usuario existe
        const userId = createTransactionParams.userId

        //puxa a funcao que acha o user pelo id enviando o id atraves do parametro
        const user = await this.GetUserByIdRepository.execute(userId)

        //caso o user nao existe, mostra um erro customizado
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        //cria um id para a transacao
        const transactionId = uuidv4()

        //efetua de fato a trasacao enviando o id dela criado
        const transaction =
            await this.postgresCreateTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })

        return transaction
    }
}
