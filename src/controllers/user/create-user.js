import { EmailAlreadyInUseError } from '../../errors/user.js'
import { createUserSchema } from '../../schemas/index.js'
import { badRequest, created, serverError } from '../helpers/index.js'
import { ZodError } from 'zod'

//RESPONSAVEL POR RECEBER OS PARAMETROS DO HTTP, VALIDAR E CHAMAR O USER CASE
export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            //verificacoes automaticas de validacao usando zod

            const params = httpRequest.body

            //verifica se o que foi passado no body corresponde ao schema definido
            await createUserSchema.parseAsync(params)

            //chamar o user case
            const createdUser = await this.createUserUseCase.execute(params)

            //retornar resposta para o usuario
            return created(createdUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
