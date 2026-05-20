import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
} from '../helpers/index.js'
import { transactionNotFoundResponse } from '../helpers/transaction.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            //verificar se o id é valido
            const idIsValid = checkIfIdIsValid(transactionId)
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId)

            if (!deletedTransaction) {
                return transactionNotFoundResponse()
            }

            return ok(deletedTransaction)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
