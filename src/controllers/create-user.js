import { CreateUserUseCase } from '../use-cases/create-user.js'
import validator from 'validator'
import { badRequest, created, serverError } from './helpers.js'

//RESPONSAVEL POR RECEBER OS PARAMETROS DO HTTP, VALIDAR E CHAMAR O USER CASE

export class CreateUserController {
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

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim() === 0) {
                    return badRequest({
                        message: `Field ${field} is required and cannot be empty`,
                    })
                }
            }

            //validando senha
            const passwordIsValid = params.password.length >= 6
            if (!passwordIsValid) {
                return badRequest({
                    message: 'Password must be at least 6 characters long',
                })
            }

            //validando email
            const emailIsValid = validator.isEmail(params.email)
            if (!emailIsValid) {
                return badRequest({ message: 'Invalid email format' })
            }

            //chamar o user case
            const createUserUseCase = new CreateUserUseCase()
            const createdUser = await createUserUseCase.execute(params)

            //retornar resposta para o usuario
            return created(createdUser)
        } catch (error) {
            console.error('Error creating user:', error)
            console.error(error)
            return serverError()
        }
    }
}
