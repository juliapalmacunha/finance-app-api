import { UserNotFoundError } from '../../errors/user.js'
import {
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'
import {
    checkIfAmountIsValid,
    checkIfTypeIsValid,
    invalidAmountResponse,
    invalidTypeResponse,
} from '../helpers/transaction.js'

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
            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided fields are not allowed ',
                })
            }

            //validar cada campo passado

            const amount = params.amount
            if (amount) {
                const amountIsValid = checkIfAmountIsValid(amount)
                if (!amountIsValid) {
                    return invalidAmountResponse()
                }
            }

            const type = params.type
            if (type) {
                const typeIsValid = checkIfTypeIsValid(type)
                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }

            const transaction = await this.updateTransactionUseCase.execute(
                transactionId,
                params,
            )

            return ok(transaction)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            return serverError()
        }
    }
}
