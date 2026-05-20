import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
} from '../helpers'

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

            const transaction =
                await this.deleteTransactionUseCase.execute(transactionId)

            return ok(transaction)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
