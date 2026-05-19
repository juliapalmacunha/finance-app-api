import {
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    created,
    serverError,
    validateRequiredFields,
    requiredFieldMissingResponse,
} from '../helpers/index.js'
import validator from 'validator'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            //antes de tudo verifica se todos os campos obrigatorios estão peenchidos
            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldsValid, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsValid) {
                return requiredFieldMissingResponse(missingField)
            }

            //verificar se o user id é valido
            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            //verificar se amount tem duas casas decimais
            const amountIsValid = validator.isCurrency(
                params.amount.toString(),
                {
                    digits_after_decimal: [2],
                    allow_negatives: false,
                    decimal_separator: '.',
                },
            )

            if (!amountIsValid) {
                return badRequest({
                    message: 'The amount must be a valid currency.',
                })
            }

            //validar se o type da transação é valido
            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) {
                return badRequest({
                    message: 'The type must be EARNING, EXPENSE or INVESTMENT.',
                })
            }

            //executar a transacao de fato chamando o usecase
            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })

            return created(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
