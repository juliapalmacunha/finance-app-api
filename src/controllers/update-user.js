import { EmailAlreadyInUseError } from '../errors/user.js'
import {
    checkIfEmailIsValid,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    emailAlreadyInUseResponse,
    invalidIdResponse,
    invalidPasswordResponse,
    badRequest,
    ok,
    serverError,
} from './helpers/index.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }

    async execute(httpRequest) {
        try {
            //ver se o id é valido
            const userId = httpRequest.params.userId

            if (!checkIfIdIsValid(httpRequest.params.userId)) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            //validar se algum campo nao permitido foi passado
            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]
            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided fields are not allowed ',
                })
            }

            //validar se a senha esta no tamanho certo, caso voce atualize o password
            if (params.password) {
                if (!checkIfPasswordIsValid(params.password)) {
                    return invalidPasswordResponse()
                }
            }

            //verificar se é um email valido, caso voce atualize o email
            if (params.email) {
                if (!checkIfEmailIsValid(params.email)) {
                    return emailAlreadyInUseResponse()
                }
            }

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            return ok(updateUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }

            console.error(error)
            return serverError()
        }
    }
}
