import { badRequest, created, serverError } from '../helpers/http'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/user'
import validator from 'validator'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            //antes de tudo verifica se todos os campos obrigatorios estão peenchidos
            const requireFields = [
                'id',
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ]

            for (const field of requireFields) {
                if (!params[field]) {
                    return badRequest({
                        message: `Missing param: ${field}.`,
                    })
                }
            }

            //verificar se o user id é valido
            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            //verificar se o amount é maior que zero
            if (params.amount <= 0) {
                return badRequest({
                    message: 'The amount must be greater than zero.',
                })
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
