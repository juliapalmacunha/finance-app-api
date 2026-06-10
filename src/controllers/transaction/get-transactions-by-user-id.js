import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
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

            if (!userId) {
                return requiredFieldMissingResponse('userId')
            }

            //verificar se o userid é um id valido
            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse(userId)
            }

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

            return serverError()
        }
    }
}
