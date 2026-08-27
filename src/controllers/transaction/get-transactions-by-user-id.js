import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user.js'
import { getTransactionsByUserIdSchema } from '../../schemas/transaction.js'
import {
    badRequest,
    ok,
    requiredFieldMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            //verificar se o userid foi passado como parametro
            const userId = httpRequest.query.userId
            const from = httpRequest.query.from
            const to = httpRequest.query.to

            if (!userId) {
                return requiredFieldMissingResponse('userId')
            }
            //verificar se from e to estão no formato correto de data
            await getTransactionsByUserIdSchema.parseAsync({
                user_id: userId,
                from,
                to,
            })

            //chamar o use case
            const transactions =
                await this.getTransactionsByUserIdUseCase.execute(userId)

            //retornar resposta http
            return ok(transactions)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message)
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            return serverError()
        }
    }
}
