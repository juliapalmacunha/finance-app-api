import { EmailAlreadyInUseError } from '../errors/user.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { badRequest, ok, serverError } from './helpers.js'
import validator from 'validator'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            //ver se o id é valido
            const userId = httpRequest.params.userId
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({
                    message:
                        'Invalid user ID format. Please provide a valid UUID.',
                })
            }

            const updateUserParams = httpRequest.body

            //validar se algum campo nao permitido foi passado
            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]
            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided fields are not allowed ',
                })
            }

            //validar se a senha esta no tamanho certo, caso voce atualize o password
            if (updateUserParams.password) {
                const passwordIsNotValid = updateUserParams.password.length < 6

                if (passwordIsNotValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters long',
                    })
                }
            }

            //verificar se é um email valido, caso voce atualize o email
            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)

                if (!emailIsValid) {
                    return badRequest({
                        message:
                            'Invalid email format. Please provide a valid email address.',
                    })
                }
            }

            const updatedUser = new UpdateUserUseCase()
            const updateUser = await updatedUser.execute(
                userId,
                updateUserParams,
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
