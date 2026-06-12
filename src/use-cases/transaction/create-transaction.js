import { UserNotFoundError } from '../../errors/user.js'
export class CreateTransactionUseCase {
    constructor(
        postgresCreateTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    ) {
        this.postgresCreateTransactionRepository =
            postgresCreateTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }

    async execute(createTransactionParams) {
        //validar se o usuario existe
        const userId = createTransactionParams.user_id

        //puxa a funcao que acha o user pelo id enviando o id atraves do parametro
        const user = await this.getUserByIdRepository.execute(userId)

        //caso o user nao existe, mostra um erro customizado
        if (!user) {
            throw new UserNotFoundError(userId)
        }

        //cria um id para a transacao
        const transactionId = await this.idGeneratorAdapter.execute()

        //efetua de fato a trasacao enviando o id dela criado
        const transaction =
            await this.postgresCreateTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })

        return transaction
    }
}
