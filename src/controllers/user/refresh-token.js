import { ZodError } from 'zod'
import { UnauthorizedError } from '../../errors/index.js'
import { refreshTokenSchema } from '../../schemas/user.js'
import { unauthorized, ok, serverError, badRequest } from '../helpers/index.js'

export class RefreshTokenController {
    constructor(refreshTokeUseCase) {
        this.refreshTokeUseCase = refreshTokeUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await refreshTokenSchema.parseAsync(params)
            console.log('params', params)
            const response = await this.refreshTokeUseCase.execute(
                params.refreshToken,
            )
            return ok(response)
        } catch (error) {
            console.log(error)
            if (error instanceof UnauthorizedError) {
                return unauthorized()
            }

            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            return serverError()
        }
    }
}
