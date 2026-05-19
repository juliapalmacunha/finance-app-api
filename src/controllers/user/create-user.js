import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailAlreadyInUseResponse,
    invalidPasswordResponse,
    badRequest,
    created,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js'

//RESPONSAVEL POR RECEBER OS PARAMETROS DO HTTP, VALIDAR E CHAMAR O USER CASE
export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            //validar requisição (campos obrigatorios, tamanho de senha e email)
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const { ok: requiredFieldsValid, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsValid) {
                return badRequest({
                    message: `The field ${missingField} is required.`,
                })
            }

            //validando senha
            if (!checkIfPasswordIsValid(params.password)) {
                return invalidPasswordResponse()
            }

            //validando email
            if (!checkIfEmailIsValid(params.email)) {
                return emailAlreadyInUseResponse()
            }

            //chamar o user case
            const createdUser = await this.createUserUseCase.execute(params)

            //retornar resposta para o usuario
            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
