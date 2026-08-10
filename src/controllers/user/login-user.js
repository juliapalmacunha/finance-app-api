import { ZodError } from 'zod'
import { loginUserSchema } from '../../schemas'
import {
    badRequest,
    notFound,
    ok,
    serverError,
    unauthorized,
} from '../helpers/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'

export class LoginUserController {
    constructor(loginUserUseCase) {
        this.loginUserUseCase = loginUserUseCase
    }

    async execute(httpRequest) {
        try {
            //capturar parametros
            const params = httpRequest.body

            //validando os campos que foram passados com zod
            await loginUserSchema.parseAsync(params)

            //caso os campos estejam validados, chamar o use case para enviar os parametros
            const user = await this.loginUserUseCase.execute(
                params.email,
                params.password,
            )

            return ok(user)
        } catch (error) {
            console.error(error)
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }
            if (error instanceof InvalidPasswordError) {
                return unauthorized()
            }
            if (error instanceof UserNotFoundError) {
                return notFound({
                    message: error.message,
                })
            }
            return serverError()
        }
    }
}
