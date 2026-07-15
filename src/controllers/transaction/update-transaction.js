import { UserNotFoundError } from '../../errors/user.js'
import { ZodError } from 'zod'
import {
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'
import { updateTransactionSchema } from '../../schemas/transaction.js'
import { transactionNotFoundResponse } from '../helpers/transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId

            //validar se o id do usuario é valido existe
            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            //validar se algum campo nao permitido foi passado
            await updateTransactionSchema.parseAsync(params)

            const updateTransaction =
                await this.updateTransactionUseCase.execute(
                    transactionId,
                    params,
                )

            return ok(updateTransaction)
        } catch (error) {
            console.error(error)
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            return serverError()
        }
    }
}
